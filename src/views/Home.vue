<template>
  <div id="home">
    <Keypress key-event="keyup" :key-code="32" :modifiers="['ctrlKey']" @success="toggleSearch" />

    <Keypress key-event="keyup" :key-code="67" :modifiers="['ctrlKey']" @success="convert" />

      <div id="surround">
            <h1>..::Convert</h1>
            <p>A scratch pad for developers to quickly convert strings into various things.</p>

        <div id="scratchpad">
            <header @click.prevent="toggleSearch">
                <div class="title" v-if="!activePad">
                  <arrow-down-circle-icon size="1.5x" class="icon"></arrow-down-circle-icon>
                    Press cntrl+space to get started
                </div>
                <div class="title" v-else>
                   <arrow-down-circle-icon size="1.5x" class="icon"></arrow-down-circle-icon>
                    {{activePad.name}} - Press cntrl+c to convert
                </div>
            </header>

            <editor id="editor" ref="editor" v-model="content" @init="editorInit" lang="html" theme="monokai" ></editor>

            <div id="searchBox" v-if="searchOpen" @click.self="toggleSearch">
                  <form id="form">
                    <input ref="search" autofocus v-on:keyup.up="upArrow" v-on:keyup.down="downArrow" v-model="searchTerm" type="search" placeholder="Search encoders, generators and convertors...">
                    <ul id="searchResults" ref="searchResults" v-if="padSearch.length > 0">
                        <li v-for="(pad,index) in padSearch" :key="pad.id"><a :class="{active:activeIndex == index}" @click.prevent="setActive(pad)" href="#">
                            <span class="title">{{pad.item.name}}</span>
                            <span class="info">{{pad.item.info}}</span>
                          </a>
                        </li>
                    </ul>
                    <ul id="searchResults" v-else-if="searchTerm !== ''">
                      <li>
                        <a href="#">
                          <span class="title">No results found</span>
                          <span class="info">Sorry</span>
                        </a>
                      </li>
                    </ul>
                  </form>
            </div>
        </div>

        <p class="footer">Created by <a href="https://aaronlumsden.com">Aaron Lumsden</a></p>

      </div>

  </div>
</template>

<script>
import { ArrowDownCircleIcon } from 'vue-feather-icons'
var pretty = require('pretty');
import Fuse from 'fuse.js';
export default {
  name: 'Home',
  data(){
    return {
      content: '',
      searchTerm: '',
      results: false,
      activePad: false,
      searchOpen: true,
      fuse: false,
      activeIndex: 0,
      pads: [{
        id: 1,
        name: 'Character count',
        info: 'Counts the number of characters in a string',
        func : function($string){
          return $string.length;
        }
      },{
        id: 2,
        name: 'Reverse string',
        info: 'Reverse the characters in a string',
        func: function($string){
          return $string.split("").reverse().join("")
        }
      },{
        id: 3,
        name: 'URL Encode',
        info: 'Encodes URL entities',
        func: function($string){
          return encodeURIComponent($string);
        }
      },{
        id: 4,
        name: 'URL Decode',
        info: 'Decodes URL entities',
        func: function($string){
          return decodeURIComponent($string);
        }
      },{
        id: 5,
        name: 'Uppercase',
        info: 'Convert a string to uppercase',
        func: function($string){
          return $string.toUpperCase();
        }
      },{
        id: 6,
        name: 'Lowercase',
        info: 'Convert a string to lowercase',
        func: function($string){
          return $string.toLowerCase();
        }
      },{
        id: 7,
        name: 'Count Lines',
        info: 'Get the line count of your text',
        func: function($string){
          return $string.split('\n').length
        }
      },{
        id: 8,
        name: 'Format JSON',
        info: 'Cleans and format JSON documents.',
        func: function($string){
          return JSON.stringify(JSON.parse($string), null, 2);
        }
      },{
        id: 9,
        name: 'Base64 Encode',
        info: 'Encodes a string to Base64',
        func: function($string){
          return btoa($string);
        }
      },{
        id: 10,
        name: 'Base64 Decode',
        info: 'Decodes a string from Base64',
        func: function($string){
          return atob($string);
        }
      },{
        id: 11,
        name: 'JSON to CSV',
        info: 'Converts JSON to comma-separated tables',
        func: function($string){

          var json = JSON.parse($string)
          var fields = Object.keys(json[0])
          var replacer = function(key, value) { return value === null ? '' : value }
          var csv = json.map(function(row){
            return fields.map(function(fieldName){
              return JSON.stringify(row[fieldName], replacer)
            }).join(',')
          })
          csv.unshift(fields.join(',')) // add header column
           csv = csv.join('\r\n');
          return csv

        }
      },{
        id: 12,
        name: 'CSV to JSON',
        info: 'Converts CSV to JSON',
        func: function($string){

          var lines=$string.split("\n");

            var result = [];

            var headers=lines[0].split(",");

            for(var i=1;i<lines.length;i++){

                var obj = {};
                var currentline=lines[i].split(",");

                for(var j=0;j<headers.length;j++){
                    obj[headers[j]] = currentline[j];
                }

                result.push(obj);

            }

            //return result; //JavaScript object
            return JSON.stringify(result); //JSON

        }
      },{
        id: 13,
        name: 'UTC Date Converter',
        info: 'Converts dates and timestamps to UTC dates',
        func: function($string){

          let string = $string

           let parsedDate = Date.parse(string)

           if (isNaN(parsedDate)) {
               parsedDate = new Date(parseInt(string))
           } else {
               parsedDate = new Date(parsedDate)
           }

           let out = parsedDate.toUTCString()

           if(out === "Invalid Date") {
               return out
           }

           return out

        }
      },{
        id: 14,
        name: 'Beautify HTML',
        info: 'Formats HTML nicely',
        func: function($string){
          return pretty($string);
        }
      },{
        id: 15,
        name: 'HTML entity encode',
        info: 'Encodes HTML into HTML entities',
        func: function($string){
          return $string.replace(/[\u00A0-\u9999<>&]/gim, function(i) {
             return '&#'+i.charCodeAt(0)+';';
          });
        }
      },{
        id: 15,
        name: 'HTML entity decode',
        info: 'Decodes HTML entities into HTML',
        func: function($string){
          var txt = document.createElement('textarea')
          txt.innerHTML = $string
          return txt.value;
        }
      }]


    }
  },
  components: {
    ArrowDownCircleIcon,
        editor: require('vue2-ace-editor'),
        Keypress: () => import('vue-keypress')
  },
  created(){
    this.fuse = new Fuse(this.pads,{
      keys: [
        "name",
        "info"
      ]
    });

    if (localStorage.getItem("active")) {
      this.searchOpen = false;
      this.activePad = JSON.parse(localStorage.getItem("active"));
    }
  },
  computed:{
    padSearch(){
      if (this.searchTerm) {
          return this.fuse.search(this.searchTerm);
      }
      return this.fuse.search(' ');

    }
  },
  methods: {
    upArrow(){
      if (this.activeIndex > 0) {
          //this.activeIndex--;
      }
    },
    downArrow(){

      if (this.activeIndex <= this.padSearch.length) {
        //  this.activeIndex++;
      }
    },
    setActive($pad){

      this.activePad = $pad.item;
      localStorage.setItem("active", JSON.stringify($pad.item));

      this.toggleSearch();

      if (this.content) {
          this.convert();
      }

    },
    convert(){
      var $content = this.activePad.func(this.content);
      this.content = String($content);

      this.$copyText(this.content).then(()=>{
        this.$snotify.success('Converted & copied to clipboard 👍');
      });

    },
    toggleSearch(){
      this.searchOpen = !this.searchOpen

      if (this.searchOpen) {
        this.$nextTick(()=>{
          this.$refs.search.focus()
        })
      }
    },
    editorInit: function () {
           require('brace/ext/language_tools') //language extension prerequsite...
           require('brace/mode/html')
           require('brace/mode/javascript')    //language
          require('brace/mode/css')    //language
           require('brace/mode/less')
           require('brace/theme/monokai')

          this.$refs.editor.editor.setShowPrintMargin(false);
       }
  }
}
</script>

<style lang="less">
#surround{
  width:80vw;
  height:70vh;
  margin-left:10vw;
    margin-top:10vh;


    h1{
      text-align: center;
      font-size:1.5rem;
      color:white;
      margin-bottom:10px;
      text-align: center;
      font-weight:bold;
    }
    p{
      color:fade(white,50);
      text-align: center;
      margin-bottom:20px;
    }
}
#scratchpad{
  //width:80vw;
  height:~"calc(100% - 50px)";
  background:red;

    border:1px solid #4c4c4c;
    background:#1f1f1f;
    border-radius:5px;
    position:relative;
    header{
      height:45px;
      width:100%;
      background: rgb(67,69,71);
      background: -moz-linear-gradient(top,  rgba(67,69,71,1) 0%, rgba(55,57,58,1) 100%);
      background: -webkit-linear-gradient(top,  rgba(67,69,71,1) 0%,rgba(55,57,58,1) 100%);
      background: linear-gradient(to bottom,  rgba(67,69,71,1) 0%,rgba(55,57,58,1) 100%);
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#434547', endColorstr='#37393a',GradientType=0 );
      border-bottom:1px solid black;

      .title{
        background: #1f1f1f;
        display: inline-block;
        padding: 7px 10px;
        width: 50%;
        margin-left: 25%;
        margin-top: 9px;
        color: white;
        text-align: center;
        font-size: 0.8rem;
        border-radius: 5px;
        box-shadow: inset 0px 0px 8px 0px rgba(0,0,0,.5);
        position:relative;

        .icon{
          position: absolute;
          right: 10px;
          width: 15px;
          top: 4px;
        }
      }

    }

    #editor{
      height:~"calc(100% - 46px)"!important;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
    }
    #searchBox{
      position:absolute;
      left:0px;
      top:0px;
      width:100%;
      height:100%;
      z-index:200;
      background:rgba(0,0,0,.6);

      #form{
        width:50%;
        margin-left:25%;
        margin-top: 45px;
        background:#24282f;
        padding:10px;
        border-radius:5px;
        border-top-left-radius:0px;
        border-top-right-radius:0px;
        max-height:80%;


        input[type="text"],input[type="search"]{
          padding:10px;
          width:100%;
          font-size:1rem;
          border-radius:5px;
          border:2px solid #4c4c4c;
          background:#202634;
          color:#568af2;
          &:focus{
            outline:0;
            border:2px solid #568af2;
          }
        }
      }
    }
}
#searchResults{
  border:1px solid black;
  margin-top:10px;
    max-height: 209px;
  overflow:auto;
  li{
    background:#292d35;


    a{
      text-decoration:none;
        padding:20px;
        display:block;
        border-bottom:1px solid black;
        .title,.info{
          display:block;

        }
        .title{
          margin-bottom:10px;
          color:white;
        }
        .info{
          font-size:0.8rem;
          color:#6e7581;
                    line-height:1.5;
        }
        &:hover,&.active{
          background:#3a3f4b;
        }
    }
    &:last-of-type{
      a{
        border-bottom:0px solid black;
      }
    }
  }
}
.footer{
  margin-top:10px;
  a{
    color:white;
    text-decoration:none;
    &:hover{
      text-decoration:underline;
    }
  }
}


</style>
