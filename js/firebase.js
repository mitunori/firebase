// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";

// 貼り付ける場所
import {
  getDatabase,
  ref,
  push,
  set,
  onChildAdded,
  remove,
  onChildRemoved,
  serverTimestamp,
  onValue,
  query,
  orderByChild,
} from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";
//

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// この辺りに書いていきます

const db = getDatabase(app);
const dbRef = ref(db, "dev245");

// 送信処理を記述
$("#send").on("click", function () {
  // id="uname" の場所を取得します🤗
  const uname = $("#uname").val();

  // console.log(uname, 'データの取得の仕方で表示が異なるのをチェックしましょう🤗')

  // id="text" の場所を取得します🤗
  const text = $("#text").val();

  // ジャンルの種類
  const type = $("input[name=type]:checked").val();
  console.log(type, "ss");

  const msg = {
    type: type,
    uname: uname,
    text: text,
    date: serverTimestamp(), //これがポイント！
  };

  // firebaseに送る準備をしていることになります🤗
  const newPostRef = push(dbRef); //データを送信できる準備
  set(newPostRef, msg); // firebaseの登録できる場所に保存するイメージです🤗

  // 送信後に、入力欄を空にしましょう🤗
  $("#uname").val("");
  $("#text").val("");

  // これを使うとどうなるかみてみましょう🤗
  $("#uname").focus();

  // send送信イベント この下消さない
});

//これでデータを取得し、その中でonChildAddedを使って処理をする
onValue(dbRef, function (data) {
  const d = data.val();
  console.log(d, "firebaseのデータ");
  const v = query(ref(db, `dev245/`), orderByChild("date"));
  console.log(v); //debug
  // 配列とonChildAddedを用いて、dateが小きい順の配列を作る
  let arrDate = []; //dateが大きい順に格納するローカル変数を宣言

  onChildAdded(v, function (data) {
    console.log(data.val());
    console.log(data.key);
    const hash = {
      key: data.key,
      type: data.val().type,
      uname: data.val().uname,
      text: data.val().text,
      date: data.val().date,
    };
    arrDate.unshift(hash); //unshiftで配列の先頭に追加する
    console.log(arrDate, "sss");
  });

  let tips = arrDate
    .filter((item) => item.type === "tips")
    .map((item, index) => {
      const d = new Date(item.date);
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDate(); //ここ間違ってました！
      let hour = d.getHours();
      let min = d.getMinutes();
      let sec = d.getSeconds();
      let h = `
      <div class="msg" data-date=${item.key}>
        <p class="title">ジャンル:${item.type}</p>
        <p>${item.uname}</p>
        <p>${item.text}</p>
        <p>${year}年${month}月${day}日${hour}:${min}:${sec}</p>
        <button id="delete">削除</button>
      </div>
    `;
      return h;
    });
  $("#output1").html(tips);

  let type = arrDate
    .filter((item) => item.type === "play")
    .map((item, index) => {
      const d = new Date(item.date);
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDate(); //ここ間違ってました！
      let hour = d.getHours();
      let min = d.getMinutes();
      let sec = d.getSeconds();
      let h = `
      <div class="msg" data-date=${item.key}>
        <p class="title">ジャンル:${item.type}</p>
        <p>${item.uname}</p>
        <p>${item.text}</p>
        <p>${year}年${month}月${day}日${hour}:${min}:${sec}</p>
        <button id="delete">削除</button>
      </div>
    `;
      return h;
    });
  $("#output2").html(type);

  let c = arrDate
    .filter((item) => item.type === "class")
    .map((item, index) => {
      const d = new Date(item.date);
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDate();
      let hour = d.getHours();
      let min = d.getMinutes();
      let sec = d.getSeconds();
      let h = `
      <div class="msg" data-date=${item.key}>
        <p class="title">ジャンル:${item.type}</p>
        <p>${item.uname}</p>
        <p>${item.text}</p>
        <p>${year}年${month}月${day}日${hour}:${min}:${sec}</p>
        <button id="delete">削除</button>
      </div>
    `;
      return h;
    });
  $("#output3").html(c);
});

// 削除をボタンを押したら⇨アラートが出れば成功！！
$(document).on("click", "#delete", function () {
  let target = $(this).parent().data("date");
  remove(ref(db, "dev245/" + target));
});

// この間に書いていきます
