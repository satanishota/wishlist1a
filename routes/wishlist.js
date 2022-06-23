var express = require('express');
var router = express.Router();
let sqlite3 = require('sqlite3');
const db = new sqlite3.Database('sqlite1a.db')//dbの名前

/* GET home page. */
router.get('/', (req, res, next)=>{
  db.serialize(()=>{//dbのメソッド
    db.all("select * from wishlist",(err,rows)=>{//SQliteのSQL文
      if(!err){
        let data={
          title:"wishlist",
          content:rows  //行をループさせる
        };
        res.render('wishlist', data ); //wishlist.ejsをレンダーする
      }
    })
  })

}) ;

router.get('/search', (req, res, next)=>{
  const keyword = req.query
  db.serialize(()=>{
    db.all(`select * from wishlist where wish LIKE"%${keyword.wish}%"`,(err,rows)=>{
      //LIKE％は曖昧検索
      if(!err){
        let data={
          title:"wishlist",
          content:rows
        };//検索前と同じ処理を書き直す
        res.render('wishlist', data );
      }
    })
  })
}) ;

router.post('/',(req, res, next)=> {
 
  let wish = req.body.wish
  let memo = req.body.memo
  let finish = req.body.finish //カラム名に合わせた
  db.serialize(()=>{
    db.exec(`insert into wishlist (wish, memo, finish) values("${wish}","${memo}","${finish}")`,(stat,error)=>{
      //notNULLのエラーが出ないので、三つとも必要
      res.redirect('/wishlist');
    });

  });
});

router.post('/id',(req, res, next)=> {//同じページのボタンを/idをつけてわけた。
 
  let id = req.body.id  //urlのpalmsで切り替えることもできる
  db.serialize(()=>{
    db.exec(`delete from wishlist where id="${id}"`,(stat,error)=>{
      res.redirect('/wishlist');
    });

  });
});

module.exports = router;