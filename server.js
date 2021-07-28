const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const bodyParser = require("body-parser");
//const serviceAccount = require("./config/hostel-manager-cbc1a-firebase-adminsdk-yfjap-b6dee44993.json");
const app = express();
dotenv.config({ path: "./config/config.env" });
const nanoid = require("nanoid");
const nodemailer = require("nodemailer");
const fs = require("fs");
var memberMails = [];
//-------------mongodb connection------------------//

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((result) => {
    console.log("the mongodb is connected");
  })
  .catch((err) => {
    console.log(err);
  });
const member = require("./database/member");
const manager = require("./database/manager");
const hostel = require("./database/hostel");
const { json } = require("body-parser");
const { Console } = require("console");
//const { db } = require("./database/member");
//const { name } = require("ejs");
//-----------------------firebase admin----------------//

/* admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hostel-manager-cbc1a.firebaseio.com",
}); */

//---------------------use------------------

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.set("view engine", "ejs");
//-----------------------------------//
//----------------- random code---------------//

function randomCode() {
  let model = nanoid(05);
  return model;
}

//----------------token verification---------------//

function tokenVerification(req, res, next) {
  if (req.headers.id != null) {
    let idToken = req.headers.id;
    // idToken comes from the client app
    admin
      .auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        res.useruid = decodedToken.uid;
        console.log("token is verified");
        console.log(decodedToken.uid);
        next();
        //  next(useruid);
      })
      .catch((error) => {
        res.send("not verified");
        console.log(error);
      });
  } else console.log("req not working");
}
//------------- user name ------------------------//

function userName(req, res, next) {
  //  console.log("username");
  let idToken = req.headers.id;
  // idToken comes from the client app
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      res.DecodedToken = decodedToken;
      res.useruid = decodedToken.uid;
      console.log("token is verified");
      //    console.log(decodedToken.uid);

      manager.exists({ firebaseuid: decodedToken.uid }).then((result) => {
        if (result) {
          manager.findOne({ firebaseuid: decodedToken.uid }).then((result) => {
            let arr = result.name;
            //  console.log(arr);
            res.Username = arr;
            next();
          });
        } else {
          member.findOne({ firebaseuid: decodedToken.uid }).then((result) => {
            let arr = result.name;
            //  console.log(arr);
            res.Username = arr;
            next();
          });
        }
      });

      //  next(useruid);
    })
    .catch((error) => {
      res.send("not verified");
      console.log(error);
    });
}

//------------------------get------------------//
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/views/login.html");
});
app.get("/h/myprofile", (req, res) => {
  res.sendFile(__dirname + "/views/userprofile/userprofile.html");
});

app.get("/h/:id/hostelbills", (req, res) => {
  res.sendFile(__dirname + "/views/billmanage/billmanage.html");
});

app.get("/h/:id/members", (req, res) => {
  res.sendFile(__dirname + "/views/members/members.html");
});

app.get("/h", (req, res) => {
  res.sendFile(__dirname + "/views/hostellist.html");
});

app.get("/rentview", (req, res) => {
  res.sendFile(__dirname + "/views/mRent/manager_rentview.html");
});

app.get("/bills", (req, res) => {
  res.sendFile(__dirname + "/views/billspermembers/billspermembers.html");
});
app.get("/h/:id", (req, res) => {
  let hostelid = req.params.id;
  res.sendFile(__dirname + "/views/hosteldash/hosteldash.html", hostelid);
});
//--------------create new user-----------------------//
app.post("/", addUser, (req, res) => {
  res.render("index");
});

function addUser(req, res) {
  console.log(
    req.body.email,
    req.body.password,
    req.body.name,
    req.body.hostel
  );
  if (req.body.password == req.body.password1) {
    admin
      .auth()
      .createUser({
        email: req.body.email,
        password: req.body.password,
      })
      .then((userrecord) => {
        if (req.body.hostel == "manager") {
          let newManager = new manager({
            name: req.body.name,
            email: req.body.email,
            firebaseuid: userrecord.uid,
            role: req.body.hostel,
          })
            .save()
            .then((result) => {
              console.log(`"user added"${result}`);
              res.sendFile(__dirname + "/views/index.html");
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          let newMember = new member({
            name: req.body.name,
            email: req.body.email,
            firebaseuid: userrecord.uid,
            role: req.body.hostel,
          })
            .save()
            .then((result) => {
              console.log(`"user added"${result}`);
              res.sendFile(__dirname + "/views/index.html");
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
  } else {
    console.log("invalid password try again..!!");
  }
}
//----------------hostels-------------------------//
app.get("/api/hosteldetails", tokenVerification, (req, res) => {
  // console.log(res.useruid);
  //  console.log(req.headers.hid);
  manager.exists({ firebaseuid: res.useruid }).then((result) => {
    if (result) {
      hostel.exists({ _id: req.headers.hid }).then((result) => {
        if (result) {
          hostel.findOne({ _id: req.headers.hid }).then((Result) => {
            console.log(Result.name);
            console.log(Result);
            res.send(Result);
          });
        }
      });
    } else {
      hostel.exists({ _id: req.headers.hid }).then((result) => {
        if (result) {
          hostel.findOne({ _id: req.headers.hid }).then((Result) => {
            console.log(Result.name);
            console.log(Result);
            res.send(Result);
          });
        }
      });
    }
  });
});
//----------- view hostel data hostels--------------------//

//-------------------------------hostels list api --------------------------//

app.get("/api/hostels", tokenVerification, (req, res) => {
  // console.log(randomCode());
  manager.exists({ firebaseuid: res.useruid }).then((result) => {
    if (result) {
      manager.findOne({ firebaseuid: res.useruid }).then((result) => {
        console.log(result);
        console.log(result.role);
        console.log(result.hostels);
        //res.send(result);
        res.send(result.hostels);
      });
    } else {
      member.findOne({ firebaseuid: res.useruid }).then((result) => {
        console.log(result);
        console.log(result.hostels);
        res.send(result.hostels);
      });
    }
  });
});

//-----------------create hostel api ------------------------------//
app.post("/api/createhostel", tokenVerification, (req, res) => {
  console.log(res.useruid);

  let Hostel = new hostel({
    name: req.body.hostelname,
    Place: req.body.hostelplace,
    hcode: randomCode(),
    Createdby: res.useruid,
  })
    .save()
    .then((result) => {
      console.log(`"user added"${result}`);
      console.log(result.Createdby);
      console.log(result._id);
      res.redirect(`/h/${result._id}`);
      try {
        manager.findOneAndUpdate(
          { firebaseuid: res.useruid },
          {
            $push: {
              hostels: {
                name: req.body.hostelname,
                hcode: result.hcode,
                hostelid: result._id,
              },
            },
          },
          (err, data) => {
            if (err) console.log(err);
            // else console.log(data);
          }
        );
      } catch (error) {
        console.log(error);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

//------------------------- join hostel--------------------//

app.post("/api/joinhostel", tokenVerification, (req, res) => {
  console.log(req.body.hcode);

  hostel.exists({ hcode: req.body.hcode }).then((result) => {
    if (result) {
      console.log(result);
      hostel
        .findOneAndUpdate(
          { hcode: req.body.hcode },
          { $push: { members: { memberuid: res.useruid } } }
        )
        .then((result) => {
          console.log(result);

          member
            .findOneAndUpdate(
              { firebaseuid: res.useruid },
              {
                $push: {
                  hostels: {
                    hostelid: result._id,
                    hcode: result.hcode,
                    name: result.name,
                  },
                },
              }
            )
            .then((data) => {
              console.log(data);
              console.log("all  success");
              res.send(console.log("all set"));
            });
        });
    } else {
      console.log("invalid hostelcode");
      res.send(console.log("invalid hostelcode"));
    }
  });
});

//---------------------------user data ------------------------//

app.get("/api/userdata", tokenVerification, (req, res) => {
  console.log(res.useruid);
  manager.exists({ firebaseuid: res.useruid }).then((result) => {
    if (result) {
      manager.findOne({ firebaseuid: res.useruid }).then((result) => {
        //   console.log(result);
        let arr = [result.name, result.role];
        console.log(arr);
        //res.send(result);
        //res.send(result.hostels);
        res.send(arr);
      });
    } else {
      member.findOne({ firebaseuid: res.useruid }).then((result) => {
        // console.log(result);
        //console.log(result.hostels);
        //  res.send(result.hostels);

        let arr = [result.name, result.role];
        console.log(arr);
        res.send(arr);
      });
    }
  });
});

//------------------- user role -----------------------------//
app.get("/api/userRole", tokenVerification, (req, res) => {
  manager.exists({ firebaseuid: res.useruid }).then((result) => {
    if (result) {
      manager.findOne({ firebaseuid: res.useruid }).then((result) => {
        console.log(result.role);
        let arr = [result.role];
        res.send(arr);
      });
    } else {
      member.findOne({ firebaseuid: res.useruid }).then((result) => {
        console.log(result.role);
        let arr = [result.role];
        res.send(arr);
      });
    }
  });
});

//------------------- user details view -------------------------//

app.get("/api/userdetais", tokenVerification, (req, res) => {
  manager.exists({ firebaseuid: res.useruid }).then((result) => {
    if (result) {
      manager.findOne({ firebaseuid: res.useruid }).then((result) => {
        console.log(result);
        res.send(result);
      });
    } else {
      member.findOne({ firebaseuid: res.useruid }).then((result) => {
        console.log(result);
        res.send(result);
      });
    }
  });
});
//----------------- user details edit  and save ------------------------//

app.post("/api/updateUserDetails", tokenVerification, (req, res) => {
  console.log(req.body.Lastname);

  manager.exists({ firebaseuid: res.useruid }).then((result) => {
    if (result) {
      console.log("its manager");
      try {
        manager
          .findOneAndUpdate(
            { firebaseuid: res.useruid },
            {
              name: req.body.Fname,
              last_name: req.body.Lastname,
              address: req.body.Uaddress,
              phone_number: req.body.phone,
              Institution: req.body.Institution,
              iaddress: req.body.iaddress,
            }
          )
          .then((result) => {
            console.log(result);
            res.send(console.log("all set"));
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        member
          .findOneAndUpdate(
            { firebaseuid: res.useruid },
            {
              name: req.body.Fname,
              last_name: req.body.Lastname,
              address: req.body.Uaddress,
              phone_number: req.body.phone,
              Institution: req.body.Institution,
              iaddress: req.body.iaddress,
            }
          )
          .then((result) => {
            console.log(result);
            res.send(console.log("all set"));
          });
      } catch (error) {
        console.log(error);
      }
    }
  });
});
//---------------------------- hostel Anouncements--------------------//
app.post("/api/anouncement", userName, (req, res) => {
  console.log(req.body.Amessage);
  console.log(res.useruid);
  console.log(res.Username);
  hostel.exists({ _id: req.body.Hostelid }).then((Result) => {
    if (Result) {
      console.log(res.useruid);
      hostel
        .findByIdAndUpdate(
          { _id: req.body.Hostelid },
          {
            $push: {
              Announcements: {
                Message: req.body.Amessage,
                date: req.body.adate,
                auther: res.Username,
              },
            },
          }
        )
        .then((data) => {
          console.log("all set");
          console.log(data);
          res.send("all set");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
});
//-----------------------anouncement view--------------------//
app.get("/api/displayAnouncement", tokenVerification, (req, res) => {
  manager.exists({ firebaseuid: res.useruid }).then((result) => {
    if (result) {
      hostel.exists({ _id: req.headers.hid }).then((result) => {
        if (result) {
          hostel.findOne({ _id: req.headers.hid }).then((Result) => {
            //  console.log(Result.Announcements);
            //  console.log(Result);
            res.send(Result.Announcements);
          });
        }
      });
    } else {
      hostel.exists({ _id: req.headers.hid }).then((result) => {
        if (result) {
          hostel.findOne({ _id: req.headers.hid }).then((Result) => {
            // console.log("anoncement")
            //  console.log(Result.Announcements);
            //   console.log(Result);
            res.send(Result.Announcements);
          });
        }
      });
    }
  });
});

//------------------------- upload file --------------------------//

app.post("/api/uploadfile", tokenVerification, (req, res) => {
  console.log(req.body.messbill);
  console.log(req.body.Month);
  console.log(req.body.Amount);
  console.log(req.body.hostelName);
});
//-------------------------hostel members-----------------------------//

app.get("/api/members", tokenVerification, (req, res) => {
  let memberData = [];
  let datalenth = null;

  hostel.exists({ _id: req.headers.hid }).then((result) => {
    if (result) {
      hostel.findOne({ _id: req.headers.hid }).then((Result) => {
        let members = Result.members;
        datalenth = member.length;
        console.log(`total length${datalenth}`);
        try {
          members.forEach( async (element) => {
           
            member.exists({ firebaseuid: element.memberuid }).then((Result) => {
              if (Result) {
                member
                  .findOne({ firebaseuid: element.memberuid })
                  .then((data) => {  
                    sendfile(data);
                  })
              }
            });
            
          })
        } catch (error) {
          console.log(error)
        }
      
      });
    }
  });

    function sendfile(data){
      memberData.push(data);
     
      let leng = memberData.length
      if(leng == (datalenth-1))
      {
        console.log("final array");
        console.log(memberData);
        res.send(memberData);
      }
    }
    
});

//-----------port listening--------------------//

const port = process.env.PORT || 3500;
app.listen(
  port,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
