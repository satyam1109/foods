const express=require("express")
const app=express();
const mongoose = require("mongoose");

const food=require('./model.js')
const bodyParser = require("body-parser");

const dotenv=require("dotenv");

const info=require('./data.js')

const cors = require('cors');

app.use(bodyParser.json());    // getting data from postman. during post command
app.use(cors())            

dotenv.config({path:'./config.env'});
const DB=process.env.DATABASE;
const port = process.env.PORT || 4500

function connectToDatabase() {
    // Connect to MongoDB Atlas
    mongoose
      .connect(
        DB,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      )
      .then(() => console.log("MongoDB connected"))
      .catch((err) => console.error(err));
}




app.get("/",async(req,resp)=>{
    
    try{
        const foods=await food.find();
        resp.status(200).json(foods);
    }
    catch(err){
        console.log("error in fetching food data");
        resp.status(500).json({error:"serer error"})
    }
})

app.get('/:category', async (req, resp) => {
    const category = req.params.category.toLowerCase(); // Convert the category to lowercase for case-insensitive matching
  
    try {
        const foods = await food.find({ 'category': category });
        resp.json(foods);
    } 
    catch (error) {
        resp.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/id/:_id', async (req, res) => {
  const foodId = req.params._id;

  try {
    const food_item = await food.findById(foodId);

    if (food_item) {
      res.json({ food_item });
    } else {
      res.status(404).json({ error: 'Food item not found' });
    }
  } catch (error) {
    console.log('Error in fetching food data: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/name/:name', async (req, resp) => {
  const name = req.params.name; // Convert the category to lowercase for case-insensitive matching

  try {
      const foods = await food.find({ 'name': name });
      resp.json(foods);
  } 
  catch (error) {
      resp.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/", async(req, resp) => {
    
    // console.log(req.body);

    // console.log("name :",req.body.name);
    // console.log("category :",req.body.category);
    // console.log("nutrition :");
    // console.log("protein :",req.body.nutrition.protein);
    // console.log("carbs are : ",req.body.nutrition.carbohydrates);
    // console.log("fats are : ",req.body.nutrition.fats);
    // console.log("fibres are :",req.body.nutrition.fibres)

    const food_item=new food({
        name:req.body.name,
        category:req.body.category,
        imageurl:req.body.imageurl,
        link:req.body.link,
        nutrition:{
            protein:req.body.nutrition.protein,
            carbohydrates:req.body.nutrition.carbohydrates,
            fats:req.body.nutrition.fats,
            fibres:req.body.nutrition.fibres,
        }
    })

    try{
        await food_item.save();

        return resp.status(200).json({message:"food item added successfully"});

    }
    catch(err){
        console.log("error in saving food item", err);

        return resp.status(500).json({error:"server error, please try again later"});
    }
    
    
});

app.delete("/:id", async (req, resp) => {
    try {
      const foodId = req.params.id;
  
      if (!mongoose.Types.ObjectId.isValid(foodId)) {
        return resp.status(400).json({ error: "Invalid food item ID" });
    
      }
  
      const food_deleted = await food.findByIdAndDelete(foodId);
  
      if (food_deleted) {
        resp.status(200).json({ message: "Food item deleted successfully" });
      } else {
        resp.status(404).json({ error: "Food item not found" });
      }
    } catch (err) {
      console.log("Error in deleting food: ", err);
      resp.status(500).json({ error: "Food item not deleted" });
    }
});
  


async function startServer() {
    try {
      await connectToDatabase();
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    } catch (error) {
      console.log("error occured in starting the server ", error);
    }
  }
  
  startServer();