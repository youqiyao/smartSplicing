let util = {

};
util.title = function(title) {
    title = title ? title + ' - Home' : '云拼接';
    window.document.title = title;
};

util.theme = function(theme) {
    theme ? document.getElementsByTagName('body')[0].setAttribute('class', theme) :
    document.getElementsByTagName('body')[0].removeAttribute('class')
};

util.clone = function(data) {
  return JSON.parse(JSON.stringify(data))
};
   /*16进制颜色转为RGB格式*/ 
util.colorHexToRgb = function(colorHex) { 
      var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/; 
      var sColor = colorHex.toLowerCase()  
      if(sColor && reg.test(sColor)){  
          if(sColor.length === 4){  
              var sColorNew = "#";  
              for(var i=1; i<4; i+=1){  
                  sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));     
              }  
              sColor = sColorNew 
          }  
          //处理六位的颜色值  
          var sColorChange = [];  
          for(var i=1; i<7; i+=2){  
              sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));    
          }  
          return "rgb(" + sColorChange.join(",") + ")";  
      }else{
          return sColor
      }
    }; 

/*RGB格式颜色转为16进制*/ 
util.colorRgbToHex = function(colorRgb) {
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  if(/^(rgb|RGB)/.test(colorRgb)){ 
      var aColor = colorRgb.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
      var strHex = "#"; 
      for(var i=0; i<aColor.length; i++){  
          var hex = Number(aColor[i]).toString(16);  
          if(hex.length === 1){  
              hex = '0' + hex;   
          }  
          strHex += hex;  
      }  
      if(strHex.length !== 7){ 
          strHex = colorRgb;    
      }   
      return strHex;  
  }else if(reg.test(colorRgb)){ 
      var aNum = colorRgb.replace(/#/,"").split(""); 
      if(aNum.length === 6){  
          return colorRgb;      
      }else if(aNum.length === 3){  
          var numHex = "#";  
          for(var i=0; i<aNum.length; i+=1){  
              numHex += (aNum[i]+aNum[i]);  
          }  
          return numHex;  
      }   
  }else{  
      return colorRgb;      
  }  
};

/*10进制格式颜色转为16进制*/ 
util.colorIntToHex = function(colorInt) {
  return '#' + colorInt.toString(16).toUpperCase()
};

/*16进制格式颜色转为10进制*/ 
util.colorHexToInt = function(colorHex) {
  return parseInt(colorHex.substr(1,6), 16)
}

/*RGBA格式颜色转为10进制*/ 
util.colorRgbaToInt = function(colorRgba) {
  var aColor = colorRgba.replace(/(?:\(|\)|rgba|RGBA)*/g, "").split(","),
  r = parseInt(aColor[0]),
  g = parseInt(aColor[1]),
  b = parseInt(aColor[2]),
  a = parseInt(255 * aColor[3]),
  colorInt = ((a<<24) >>> 0) + (r<<16) + (g<<8) + b
  return colorInt
}
/*10进制格式颜色转为RGBA*/
util.colorIntToRgba = function(intColor) {
  var a = ((intColor >>> 24) / 255).toFixed(2),
  r = (intColor >>> 16) & 0xff,
  g = (intColor >>> 8) & 0xff,
  b = intColor & 0xff
  return `rgba(${r}, ${g}, ${b}, ${a})`
}
export default util;