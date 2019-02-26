const express=require("express");
const router=express.Router();
const pool=require("../pool");

router.get("/",(req,res)=>{
  var lid=req.query.lid;
  var output={
    product:{},//当前商品的详细信息
    specs:[],//规格列表
    pics:[] //当前商品所有图片的列表
  }
  var sql="select * from xz_laptop where lid=?";
  pool.query(sql,[lid],(err,result)=>{
    if(err) console.log(err);
    output.product=result[0];
    var sql="select lid,spec from xz_laptop where family_id=?";
    pool.query(sql,[result[0]["family_id"]],(err,result)=>{
      if(err) console.log(err);
      output.specs=result;
      var sql="select * from xz_laptop_pic where laptop_id=?";
      pool.query(sql,[lid],(err,result)=>{
        if(err) console.log(err);
        output.pics=result;

        res.writeHead(200,{
          "Access-Control-Allow-Origin":"*"
        });
        res.write(JSON.stringify(output));
        res.end();
      })
    })
  })
})

module.exports=router;