
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path"); 
const { type } = require("os");
const { stringify } = require("querystring");
const app = express();
const port =   2000;
//process.env.PORT ||
// Middlewares
app.use(express.json());
app.use(cors());

// MongoDB connection mongodb+srv://liblissz:goldblissz@cluster0.euum22k.mongodb.net/

// mongoose.connect("mongodb+srv://vildash:goldblissz%403@cluster0.zejliuo.mongodb.net/holyconcept")
mongoose.connect('mongodb+srv://liblissz:goldblissz@cluster0.euum22k.mongodb.net/holyconcept')
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => console.error("❌ MongoDB connection failed:", err));


// Test API
app.get("/", (req, res) => {
  res.send("Express app is running god");
});

//image storage engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req,file,cb)=>{
  return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

//creating upload end point for images
app.use('/images', express.static('upload/images'));




app.post('/upload', upload.single('product'), (req, res) => {
  if (req.file) {
    res.json({ success: true, img_url: 'https://holyconceptsbackend.onrender.com/images/' + req.file.filename });
  } else {
    res.json({ success: false });
  }
});



//schema for the products

const Product = mongoose.model("product", {
  id:{
    type: Number,
    require: true,
  },
  name:{
type: String,
require: true,
  },
  image:{
type: String,
require: true,
  },
  category: {
    type: String,
    require: true
  },
  new_price:{
    type: Number,
    require: true
  },
   old_price:{
    type: Number,
    require: true
  },
  date:{
    type: Date,
   default: Date.now
  },
  avaliable:{
type: Boolean,
default: true,
  }

})


app.post('/addproduct', async(req, res)=>{
  let products = await Product.find({})
  let id;
  if(products.length>0){
    let last_product_array = products.slice(-1)
    let last_product = last_product_array[0]
    id = last_product.id + 1
  }else{
    id = 1
  }
const product = new Product({
  id: id,
  name: req.body.name,
  image: req.body.image,
  category: req.body.category,
  new_price: req.body.new_price,
 old_price: req.body.old_price,

});
console.log(product)
await product.save()
console.log("saved")
res.json({
  success: true,
  name: req.body.name,
})
})

//Creatin API for deleting product

app.post('/removeproduct', async(req,res)=>{
  await Product.findOneAndDelete({id: req.body.id})
console.log("removed")
res.json({
  success: true,
  name: req.body.name
})
})



// creating API for geting all products


app.get('/allproducts', async (req, res) => {
  try {
    let products = await Product.find({});
    console.log("✅ All products fetched");
    res.json({ success: true, products });
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


//schema for user model

const User = mongoose.model('User', {
  name:{
    type: String
  },
  email:{
    type: String,
    unique: true
  },
  password:{
    type: String
  },
  cartData:{
    type: Object
  },
  date:{
    type: Date,
    default: Date.now
  }


})

//creating endpoint for registering the user
// const jwt = require('jsonwebtoken');

// app.post('/signup', async (req, res) => {

//   let check = await User.findOne({ email: req.body.email });

//   if (check) {
//     return res.status(400).json({
//       success: false,
//       errors: "the email have beeing used already choose another email"
//     });
//   }

//   let cart = {};

//   for (let i = 0; i < 300; i++) {
//     cart[i] = 0;
//   }

//   const user = new User({
//     name: req.body.username,
//     email: req.body.email,
//     password: req.body.password,
//     cartData: cart
//   });

//   await user.save();

//   const data = {
//     user: {
//       id: user.id
//     }
//   };

//   const token = jwt.sign(data, 'secrete-ecom');

//   res.json({ response: true, token });

// });


const jwt = require('jsonwebtoken');
const { log } = require("console");

// ✅ Middleware to parse JSON
app.use(express.json());

// ... your mongoose connection and other setup

app.post('/signup', async (req, res) => {
  try {
    let check = await User.findOne({ email: req.body.email });

    if (check) {
      return res.status(400).json({
        success: false,
        errors: "The email has already been used. Choose another."
      });
    }

    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    const user = new User({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cartData: cart
    });

    await user.save();

    const data = {
      user: {
        id: user.id
      }
    };

    const token = jwt.sign(data, 'secrete-ecom');

    res.json({ success: true, token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const PassCompare = req.body.password === user.password;

      if (PassCompare) {
        const data = {
          user: {
            id: user.id,
          },
        };

        const token = jwt.sign(data, "secrete-ecom");

        return res.json({ success: true, token });
      } else {
        return res.json({ success: false, errors: "wrong password" });
      }
    } else {
      return res.json({ success: false, errors: "User not found" });
    }

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});


//creating endpoint for new collection

app.get('/newcollection', async (req, res)=>{
let product = await  Product.find({})
let newcollection = product.slice(1).slice(-8)

console.log("newcollection fetched")
res.send(newcollection)
})


//creating endpoint for popurlar products

app.get('/popurlarinwomen', async (req, res) => {
  try {
    const products = await Product.find({ category: "women" });
    const popular_in_women = products.slice(0, 4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
  } catch (error) {
    console.error("Error fetching popular products in women:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

//creating middleware to fetch users
const fetchUser = async (req, res, next)=>{
  const token = req.header('auth-token')
  if(!token){
    res.status(401).send({errors: "please authenticate a valid token"})
  }else{
    try{
 const data = jwt.verify(token, "secrete-ecom")
 req.user = data.user
 next()
    }catch(error){
res.status(401).send({errors: "please authenticate a valid token"})
    }
  }
}

//creating api for adding product to cart
app.post('/addtocart', fetchUser, async (req, res) => {
     console.log("Request Body:", req.body);
    console.log("Authenticated User:", req.user);
  try {
    let userData = await User.findOne({ _id: req.user.id });

    // Initialize cartData if not present
    if (!userData.cartData) {
      userData.cartData = {};
    }

    const itemId = req.body.itemId;

    // Ensure the item exists in the cartData
    if (!userData.cartData[itemId]) {
      userData.cartData[itemId] = 1;
    } else {
      userData.cartData[itemId] += 1;
    }

    await User.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );

    res.send("added");
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).send("Internal Server Error");
  }
});

//creating api to remove cart

app.post('/removefromcart',fetchUser, async (req,res)=>{
  console.log("Remove :", req.body );
    // console.log("Authenticated User:", req.user);
 try {
    let userData = await User.findOne({ _id: req.user.id });

    // Initialize cartData if not present
    if (!userData.cartData) {
      userData.cartData = {};
    }

    const itemId = req.body.itemId;

    // Ensure the item exists in the cartData
    if (!userData.cartData[itemId]) {
      userData.cartData[itemId] = 1;
    } else {
      if(userData.cartData[itemId]>0){
      userData.cartData[itemId] -= 1;
      }

    }

    await User.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );

    res.send("Removed");
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).send("Internal Server Error");
  }
})
//creating api end point to get card data
app.post('/getcart',fetchUser, async (req, res)=>{
 console.log("getcard")

 const userData = await User.findOne({_id: req.user.id})
 res.json(userData.cartData)
})

//email logic







// Start server
app.listen(port, (error) => {
  if (!error) {
    console.log("✅ Server running on port " + port);
  } else {
    console.error("❌ Server error:", error);
  }
});


// index.js

require('./server');
require('./notification');
require('./emailJob');

console.log("All backend services started.");





































