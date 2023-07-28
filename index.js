var express = require('express');
var connect = require('./controllers/connect.js');
var app = express();
var session=require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var cookieParser=require('cookie-parser');
var multer=require('multer');
var path=require("path");
var fs=require('fs');
var date=require('date-and-time');
const { createInvoice } = require("./controllers/invoice.js");


app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(session({
	secret: 'Your secret key',
	resave: false,
	saveUninitialized: false,
  cookie:{secure:false,maxAge:3600000}
}));
app.use(flash());
var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, './public/uploads/')     
  },
  filename: (req, file, callBack) => {
      callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({
  storage: storage
});
//about page
app.get("/", function(req,res){
	res.render("index");
});
//login page
app.get("/login", function(req,res){
  if(!req.session.loggedinUser){
	res.render("login",{ msg:req.flash('l-error') });
  }
});
/*app.get('/u',function(req,res){
  invoice={};
  createInvoice(invoice, "public/invoice/invoice.pdf");
})*/
//signup page
app.get("/signup", function(req,res){
	res.render("signup",{msg:req.flash('s-error')});
});
//admin login page
app.get("/adminlogin",function(req,res){
  if(!req.session.loggedinUser){
 res.render("adminlogin",{msg:req.flash('a-error')});
 
  }
});
//signup function
app.post("/signup",function(req,res){
  input={
    u_name : req.body.username,
    u_pass : req.body.password,
    phno : req.body.phno,
    email : req.body.email,
    address : req.body.address,
  }
  var sql='INSERT INTO users SET ?';
  connect.query(sql,input,function(err,data){
    if(err) {
      
      console.log(err);
      req.flash("s-error","Error ocuured will signing please enter credential again")
      res.redirect('/signup');
    }
    else{
      res.redirect('/login');
    }
    
  });
});
//login function
  app.post("/login",function(req,res){
    if(!req.session.u_name){
    var u_name=req.body.username1;
    var u_pass=req.body.password;

    var sql='SELECT * FROM users WHERE u_name =? AND u_pass =?';
    connect.query(sql,[u_name,u_pass],function(err,data,fields){
      if(err) throw err;
      if(data.length>0){
        req.session.loggedinUser=true;
        console.log(req.session.loggedinUser);
        req.session.u_name=u_name;
        res.redirect('/raisefund');
      }
        else{
          req.flash("l-error","Invalid Username or password");
          res.redirect('/login');
        }

      });
    }
});
// admin login function
app.post('/adminlogin',function(req,res){
  var u_name=req.body.username;
  var u_pass=req.body.password;
  
  var sql='SELECT * FROM username WHERE u_name = ? AND u_pass = ?';
  connect.query(sql,[u_name,u_pass],function(err,data,fields){
    if(err) throw err;
    if(data.length>0){
      req.session.loggedinadmin=true;
      req.session.u_name=u_name;
      res.redirect('/viewdonationsadmin');
    }
      else{
        req.flash('a-error','invalid username and password');
        res.redirect('/adminlogin');
      }

    });

});                                                

//-----------------------------------------------------admin pages--------------------------------------------------------------------
//--------------------------------------------------view donations page---------------------------------------------------------------

app.get('/viewdonationsadmin',function(req,res,next){
  if(req.session.loggedinadmin){
    console.log(req.session.loggedinadmin)
    var sql='SELECT * FROM doner';
    connect.query(sql,function(err,data,fields){
      if(err) throw err;
      res.render('viewdonationsadmin',{name:req.session.u_name,audata: data});
    });
  }
  else
  {
    res.redirect('/adminlogin');
  }
});

//-------------------------------------------------charity request page-----------------------------------------------------------------

app.get('/doner',function(req,res,next){
  if(req.session.loggedinadmin)
  {
    var sql='SELECT * FROM raise';
    connect.query(sql,function(err,data,fields){
      if(err) throw err;
      console.log(data);
      res.render('doner',{name:req.session.u_name,acdata: data,msg:req.flash('eemsg')});
    });
    
  }
  else
  {
    res.redirect('/adminlogin');
  }
});
app.post('/doner',function(req,res,next){
  if(req.body.selected){
    var ch=req.body.selected;
    console.log(ch);
    for(i=0;i<ch.length;i++)
    {
      console.log(ch[i]);
      var sql3='SELECT * FROM raise WHERE id=?';
      connect.query(sql3,ch[i],function(err,data){
        if(err) throw err;
        input={
        name:data[0].name,
        purpose:data[0].purpose,
        founder:data[0].founder,
        cover:data[0].cover,
        }
        var sql2='INSERT into charities SET ?';
        connect.query(sql2,input,function(err,data){
          if (err) throw err;
        });
    });
     
    var sql = 'DELETE FROM raise WHERE id =?';
    connect.query(sql,ch[i],function(err,data){
      if(err) throw err;
    });
  
  }
  req.flash('semsg','Sucessfully accepted');
  res.redirect('/list');
  }
  else
  {
    req.flash('eemsg','PLease select the charity');
    res.redirect('/doner');
  }
});

//----------------------------------------------------------view charities------------------------------------------------------------- 

app.get('/list',function(req,res){
  if(req.session.loggedinadmin)
  {
    var sql='SELECT * FROM charities';
    connect.query(sql,function(err,data,fields){
      if(err) throw err;
      res.render('list',{name:req.session.u_name,lddata: data,msg:req.flash('semsg'),smsg:req.flash('sadd')});
    });
  }
  else{
    res.redirect('/adminlogin');
  }
});

//----------------------------------------------------delete charity page-------------------------------------------------------------

app.get('/deletecharity',function(req,res,next){
  if(req.session.loggedinadmin)
  {
    var fname=req.session.u_name;
    var sql='SELECT * FROM charities';
    connect.query(sql,[fname],function(err,data,fields){
      if(err) throw err;
      res.render('deletecharity',{name:req.session.u_name,pddata: data,smsg:req.flash('deletesucess'),emsg:req.flash('selectfilepls')});
    });
    
  }
  else
  {
    res.redirect('/adminlogin');
  }
});
app.post('/deletecharity',function(req,res){
  if(req.body.selected){
  var ch=req.body.selected;

  for(i=0;i<ch.length;i++)
  {
    var sql1 = 'SELECT cover from charities where id=?'
  connect.query(sql1,[ch[i]],function(err,data){
    cover='public/'+data[0].cover;
    fs.unlink(cover, function(err) {
      if (err) {
        throw err
      } else {
        console.log("Successfully deleted the file.")
      }
    })
  })

  var sql = 'DELETE FROM charities WHERE id =?';
  connect.query(sql,[ch[i]],function(err,data){
    if(err) throw err;
  });

}
req.flash('deletesucess','Successfully deleted the charity');
res.redirect('/deletecharity');
}
else
{
  req.flash('selectfilepls','please select the file');
  res.redirect('/deletecharity');
}
});

//----------------------------------------------------add charity page--------------------------------------------------------------------------------------

app.get('/addCharity',function(req,res){
  if(req.session.loggedinadmin)
  {
    res.render('addcharity',{name:req.session.u_name,msg:req.flash('fnot')});
  }
  else{
    res.redirect('/adminlogin')
  }
});
app.post("/addcharity", upload.single('image'), (req, res) => {
  if (!req.file) {
      req.flash("fnot","No file upload");
      res.redirect('/addcharity');
  } else {
      console.log(req.file.filename);
      input={
      name : req.body.c_name,
      purpose : req.body.c_purpose,
      founder : req.body.founder,
      cover : 'uploads/' + req.file.filename
      } 
      var insertData = "INSERT INTO charities SET ?"
      connect.query(insertData, input, (err, data) => {
          if (err) {res.render('raise fund',{alertMsg:'Error please enter data again'});}
          else
          {
            req.flash('sadd',"sucessfully added charity");
            res.redirect('/list');
          }
      })
  }
});

//-------------------------------------------------------User pages--------------------------------------------------------------------

//-------------------------------------------------------raise charity page------------------------------------------------------------

app.get('/raisefund',function(req,res,next){
  if(req.session.loggedinUser)
  {
    res.render('raisefund',{name:req.session.u_name,msg:req.flash('errormsg')});
  }
  else
  {
    res.redirect('/login');
  }
});

app.post("/raisefund", upload.single('image'), (req, res) => {
  if (!req.file) {
      req.flash('errormsg','File Not upload');
      res.redirect('/raisefund');
  } else {
      console.log(req.file.filename);
      input={
      founder : req.body.founder,
      name : req.body.c_name,
      purpose : req.body.c_purpose,
      cover : 'uploads/' + req.file.filename
      } 
      var insertData = "INSERT INTO raise SET ?"
      connect.query(insertData, input, (err, data) => {
          if (err) throw err;
        
      });
      req.flash('successmessage','Successfully raise charity wait untill accepted');
      res.redirect('/delcharity');
  }
});
//-------------------------------------------------------view donations page-----------------------------------------------------------
app.get('/viewdonations',function(req,res,next){
  if(req.session.loggedinUser)
  {
    var fname=req.session.u_name;
    var sql='SELECT * FROM doner where founder=?';
    connect.query(sql,[fname],function(err,data,fields){
      if(err) throw err;
      res.render('viewdonations',{name:req.session.u_name,udata: data});
    });
    
  }
  else
  {
    res.redirect('/login');
  }
});

//-----------------------------------------------------delete charity page-------------------------------------------------------------

app.get('/delcharity',function(req,res,next){
  if(req.session.loggedinUser)
  {
    var fname=req.session.u_name;
    var sql='SELECT * FROM charities where founder=?';
    connect.query(sql,[fname],function(err,data,fields){
      if(err) throw err;
      res.render('delcharity',{name:req.session.u_name,ddata: data,smsg:req.flash('d-sucess'),emsg:req.flash('d-error'),scmsg:req.flash('successmessage')});
    });
    
  }
  else
  {
    res.redirect('/login');
  }
});

app.post('/delcharity',function(req,res){
  if(req.body.selected){
  var ch=req.body.selected;
  for(i=0;i<ch.length;i++)
  {
  var sql1 = 'SELECT cover from charities where id=?'
  connect.query(sql1,[ch[i]],function(err,data){
    cover='public/'+data[0].cover;
    fs.unlink(cover, function(err) {
      if (err) {
        throw err
      } else {
        console.log("Successfully deleted the file.")
      }
    })
  })
  
 var sql = 'DELETE FROM charities WHERE id =?';
  connect.query(sql,[ch[i]],function(err,data){
    if(err) throw err;
  });

}
req.flash('d-sucess','Successfully deleted the charity');
res.redirect('/delcharity');
}
else
{
  req.flash('d-error','Please select the charity');
  res.redirect('/delcharity');
}
});

//--------------------------------------------------update photo page------------------------------------------------------------------

app.get('/updatephoto',function(req,res){
  if(req.session.loggedinUser)
  {
  var fname=req.session.u_name;
  var sql='SELECT * FROM charities where founder=?';
    connect.query(sql,[fname],function(err,data){
      if(err) throw err;
      res.render('updatephoto',{name:req.session.u_name,updata: data,msg:req.flash('upse')});
    });
  }
  else
  {
    res.redirect('/login');
  }

});
app.post('/updatephoto',function(req,res){
  pf={
  id: req.body.idc,
  name: req.body.namec
  }
  res.render('update',{name:req.session.u_name,p: pf,msg:req.flash('upse')});

});
app.post('/update',upload.single('image'),function(req,res){
  if (!req.file) 
  {
    pf=
    {
      id : req.body.myid,
      name: req.body.c_name
  }
  req.flash('filenot','file not upload')
    res.render('update',{name:req.session.u_name,p: pf,msg:req.flash('filenot')});
  }

else {
    console.log(req.file.filename);
    input={
    cover : 'uploads/' + req.file.filename
    } 
    var myid=req.body.myid;
    var cname=req.body.c_name;
    var sql1 = 'SELECT cover from charities where id=?'
  connect.query(sql1,[myid],function(err,data){
    cov='public/'+data[0].cover;
    fs.unlink(cov, function(err) {
      if (err) {
        throw err
      } else {
        console.log("Successfully deleted the file.")
      }
    })
  })
    var insertData = "UPDATE charities SET ? WHERE id = ?"
    connect.query(insertData, [input,myid], (err, data) => {
        if (err) throw err; 
        
        else
        {
          req.flash('upse','Sucessfully Updated Photo');
          res.redirect('/updatephoto');
        }
    });
}
});

//---------------------------------------------View charity page(Donor)----------------------------------------------------------------

app.get('/charity',function(req,res){
  req.session.loggedinUser=true;
  var sql='SELECT * FROM charities';
    connect.query(sql,function(err,data,fields){
      if(err) throw err;
      res.render('charity',{cdata: data});
    });

});
app.post('/charity',function(req,res){
  pf={
  purpose: req.body.purpose,
  founder: req.body.founder
  }
  res.render('donate',{p: pf});

});

//------------------------------------------------------donate charity page----------------------------------------------------------

app.post('/donate',function(req,res){
input={
  d_name : req.body.d_name, 
  d_amount : req.body.d_amount, 
  d_purpose : req.body.d_purpose,
  d_date : new Date(), 
  d_addr : req.body.d_address, 
  d_cell : req.body.d_cell, 
  d_pay : req.body.d_pay, 
  d_paytype : req.body.d_paytype,
  founder : req.body.founder
  
}
pf={
  purpose: req.body.d_purpose,
  founder: req.body.founder
  }
var sql='INSERT INTO doner SET ?';
  connect.query(sql,input,function(err,result){
    if(err){
      req.flash("c-error","error occured please fill form again");

      res.render('donate',{p: pf,msg: req.flash('c-error')});
    }
    else if(req.body.d_pay=='Unpaid'){
      req.flash('CSA','Your invoice id is :-'+result.insertId+' Pay it asap');
      res.redirect('/unpaid');
    }
    else{
      
      createInvoice(result.insertId,input, "public/invoice/"+result.insertId+".pdf");
      req.flash('c-success','successfully donated your invoice Id :-'+result.insertId);
      res.redirect('/search');
    }
    
});
});

//--------------------------------------------search donation page----------------------------------------------------------------------

app.get('/search',function(req,res,next){
    res.render('search',{myd: false,msg:req.flash('c-success'),emsg:req.flash('idnotfound'),eemsg:req.flash('rte')});
});
app.post('/search',function(req,res,next){ 
  var d_id=req.body.invoiceid;
  var d_name=req.body.d_name;
  var sql='SELECT * FROM doner WHERE d_id=? AND d_name=?';
  connect.query(sql,[d_id,d_name],function(err,data,fields){
    if(err) throw err;
    else{
      if(data.length==0)
        req.flash('idnotfound','Id and name not found');
    res.render('search',{myd:true,mydata: data,msg:req.flash('c-success'),emsg:req.flash('idnotfound'),eemsg:req.flash('rte')});
  }
  });
});

//------------------------------------------- unpaid donations page--------------------------------------------------------------------

app.get('/unpaid',function(req,res,next){
  res.render('unpaid',{myd: false,msg:req.flash('usc'),emsg:req.flash('idf'),eemsg:req.flash('sert'),eeemsg:req.flash('CSA')});
});
app.post('/unpaid',function(req,res,next){ 
  var d_id=req.body.invoiceid;
  var d_name=req.body.d_name;
  var sql="SELECT * FROM doner WHERE d_id=? AND d_name=? AND d_pay='Unpaid'";
  connect.query(sql,[d_id,d_name],function(err,data,fields){
    if(err) throw err;
    else{
      if(data.length==0){
        req.flash('idf','Id and name not found');
        res.redirect('/unpaid');
      }
    res.render('unpaid',{myd:true,mydata: data,msg:req.flash('usc'),emsg:req.flash('idf'),eemsg:req.flash('sert'),eeemsg:req.flash('CSA')});
  }
  });
});

app.post('/pay',function(req,res){
if(req.body.selected){
    var ch=req.body.selected;
  for(i=0;i<ch.length;i++){
    input={
      d_pay:'Paid',
      d_date:new Date()
    }
  var sql = "UPDATE `doner` SET ? WHERE d_id=?";
  connect.query(sql,[input,ch[i]],function(err,data){
    if(err) throw err;
  });
  var sql3="SELECT * FROM doner WHERE d_id=?";
    connect.query(sql3,[ch[i]],function(err,data){
      if(err) throw err;
      var id=data[0].d_id;
      input={
        d_name : data[0].d_name, 
  d_amount : data[0].d_amount, 
  d_purpose : data[0].d_purpose,
  d_date : data[0].d_purpose, 
  d_addr : data[0].d_addr, 
  d_cell : data[0].d_cell, 
  d_pay : data[0].d_pay, 
  d_paytype : data[0].d_paytype,
  founder : data[0].founder
        }
      createInvoice(id,input, "public/invoice/"+id+".pdf");
    })
}
req.flash('rte','Successfully Paid');
res.redirect('/search');
}
else
{
  req.flash('sert','please selected if you want to donate');
  res.redirect('/unpaid');
}
  
});

// logout functions 
app.get('/logout',function(req,res){
  req.session.destroy();
  res.redirect('/login');
});
app.get('/logoutadmin',function(req,res){
  req.session.destroy();
  res.redirect('/adminlogin');
});

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
 });