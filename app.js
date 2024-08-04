const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const  methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listeningSchema} = require("./schema.js");
const {categorySchema} = require("./schema2.js");
const Category = require("./models/category.js");
const Product = require('./models/product');
 
const User = require('./models/product');  
const Cart = require('./models/listing');  

main().then(()=>{
    console.log("connnected to DB");
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.engine('ejs', ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.get("/", async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/home.ejs", {allListings});
})
//Index Route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});
// New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})
 
app.get("/category", (req,res)=> {
    res.render("listings/category.ejs");
})

//create a new category
app.post("/category", wrapAsync(async(req, res, next ) => {
        let result = categorySchema.validate(req.body);
        console.log(result);
        if(result.error){
            throw new ExpressError(400, result.error``);
        }
        let category = req.body.category;
        let newCategory = new Category(category);
        await newCategory.save(); 
        res.redirect("/showcategory");
}))

//Create Route
app.post("/listings", wrapAsync(async(req, res, next ) => {
        let result = listeningSchema.validate(req.body);
        console.log(result);
        if(result.error){
            throw new ExpressError(400, result.error``);
        }
        let listing = req.body.listing;
        let newListing = new Listing(listing);
        await newListing.save(); 
        res.redirect("/listings");
}))
//Show Categories
app.get("/showcategory" ,wrapAsync(async (req, res) => {
    const allMerchandise = await Category.find({ section: "merchandise" });
    const allEquipment = await Category.find({ section: "equipment" });
    res.render("listings/showcategory.ejs", {allMerchandise,allEquipment});
}))

//delete category
app.delete("/showcategory/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    await Category.findByIdAndDelete(id);
    res.redirect("/showcategory");
}))

//Show Route
app.get("/listings/:id" ,wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}))

  
//Edit Route
app.get("/listings/:id/edit" , wrapAsync(async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}))
//Update Route
app.put("/listings/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id, {...req.body.listing});
   res.redirect("/listings");
}))
//delete Route
app.delete("/listings/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
})

// Custom Error Handeling
app.use((err, req, res, next) => {
    let {status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("error.ejs", {err});
    // res.status(status).send(message);
})

// app.listen(4000, ()=>{
//     console.log(`app is listening on port 3000`);
// })

// end points



// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/wanderlust', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API endpoint to get products
app.get('/api/products', async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// API endpoint to get a single product by ID
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.json(product);
});

// API endpoint to add a product to the cart
app.post('/api/cart', async (req, res) => {
  const { userId, productId, quantity } = req.body;
  const cart = await Cart.findOne({ userId });
  if (cart) {
    // Update existing cart
    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    await cart.save();
  } else {
    // Create new cart
    const newCart = new Cart({ userId, items: [{ productId, quantity }] });
    await newCart.save();
  }
  res.status(201).json({ message: 'Product added to cart' });
});

// API endpoint to get user's cart
app.get('/api/cart/:userId', async (req, res) => {
  const { userId } = req.params;
  const cart = await Cart.findOne({ userId }).populate('items.productId');
  res.json(cart);
});

// API endpoint for user authentication (simple version)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
