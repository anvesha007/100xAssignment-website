const express=require("express");
const app=express();
const cors = require("cors");
const postModel=require("./models/model.schema");
app.use(express.json());
//const rateLimit = require("express-rate-limit");
//https://100x-assignment-website.vercel.app/
app.use(cors({
    origin: ["http://localhost:5173",
      "https://100x-assignment-website.vercel.app/"  
    ],
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "password"]
}));

// const passwordLimiter = rateLimit({
//     windowMs: 1 * 60 * 1000, // 1 minutes
//     max: 5, // 5 attempts
//     message: {
//         message: "Too many password attempts. Try again after 10 minutes."
//     },
//     standardHeaders: true,
//     legacyHeaders: false,
// });

function verifyAdmin(req,res,next){
    const password=req.headers.password;
    if(!password){
        return res.status(400).json({
            message: "password required"
        })
    }
    if(password!==process.env.ADMIN_PASSWORD){
        return res.status(400).json({
            message: "Unauthorized"
        })
    }
    next();  
}
app.post("/100xassignments",verifyAdmin,async(req,res)=>{
    try{
        const{link, text}=req.body;

        const upload=await postModel.create({
            link,text
        })
        return res.status(201).json({
            message: "uploaded successfully",
            upload
        })
    }
    catch(err){
        return res.status(500).json({
            message: "server error"
        })
    }
})
app.get("/100xassignments", async(req, res)=>{
    try{
        const upload=await postModel.find();
        return res.status(200).json({
            upload
        })
    }
    catch(err){
        return res.status(500).json({
            message: "server error"
        })
    }
})
app.delete("/100xassignments/:id",verifyAdmin,async(req,res)=>{
    try{
        await postModel.findByIdAndDelete(req.params.id);
        return res.json({ message: "Deleted successfully" });
    }
    catch(err){
        return res.status(500).json({
            message: "server error"
        })
    }
})

module.exports=app;