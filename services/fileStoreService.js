const supabase = require("../Util/Supabase");
const fs = require("fs").promises

// const Bucket_Name = "ProductImg";

async function createFileInFileStore(buketName,filename,fileData){
    try{

    const {data,error} = await supabase.storage.from(buketName).upload(`${filename}`,fileData);

    if(error){
        return {error}
    }
    if(data){
        return {data}
    }
    
    }catch(e){
       console.log(e)
    }
}

async function createFile(req,res,next){
    const img  = req.file;
    const fileData = await fs.readFile(img.path)
    const {data,error} = await supabase.storage.from('ProductImg').upload(`${img.filename}`,fileData);
    res.send(data)
}


module.exports = {createFileInFileStore}
module.exports.createFile = createFile;


