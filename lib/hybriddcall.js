ychan=function(usercrypto,step,txtdata){var encdata=ychan_encode(usercrypto,step,txtdata);return"y/"+encdata};ychan_obj=function(usercrypto,step,encdata){return JSON.parse(ychan_decode(usercrypto,step,encdata))};ychan_encode=function(usercrypto,step,txtdata){var session_object=read_session(usercrypto.user_keys,usercrypto.nonce);var sessionid=session_object.session_pubsign;var server_session_pubkey=nacl.from_hex(session_object.server_pubkey);var client_session_seckey=nacl.from_hex(session_object.session_seckey);var nonce1_dec=new Decimal(hex2dec.toDec(session_object.nonce1));var nonce2_dec=new Decimal(hex2dec.toDec(session_object.nonce2));var step_dec=new Decimal(step);var nonce_constr=nonce1_dec.plus(nonce2_dec).plus(step_dec).toDecimalPlaces(64);var nonce_convert=hex2dec.toHex(nonce_constr.toFixed(0).toString());var nonce_conhex=nonce_convert.substr(2,nonce_convert.length);var session_nonce=nacl.from_hex(nonce_conhex);var crypt_utf8=nacl.encode_utf8(txtdata);var crypt_bin=nacl.crypto_box(crypt_utf8,session_nonce,server_session_pubkey,client_session_seckey);var encdata=nacl.to_hex(crypt_bin);return sessionid+"/"+step+"/"+UrlBase64.safeCompress(encdata)};ychan_decode=function(usercrypto,step,encdata){if(encdata==null){txtdata=null}else{encdata=UrlBase64.safeDecompress(encdata);var session_object=read_session(usercrypto.user_keys,usercrypto.nonce);var server_session_pubkey=nacl.from_hex(session_object.server_pubkey);var client_session_seckey=nacl.from_hex(session_object.session_seckey);var nonce1_dec=new Decimal(hex2dec.toDec(session_object.nonce1));var nonce2_dec=new Decimal(hex2dec.toDec(session_object.nonce2));var step_dec=new Decimal(step);var nonce_constr=nonce1_dec.plus(nonce2_dec).plus(step_dec).toDecimalPlaces(64);var nonce_convert=hex2dec.toHex(nonce_constr.toFixed(0).toString());var nonce_conhex=nonce_convert.substr(2,nonce_convert.length);var session_nonce=nacl.from_hex(nonce_conhex);var hexdata=encdata;if(hexdata!=null){var crypt_hex=nacl.from_hex(hexdata);var crypt_bin=nacl.crypto_box_open(crypt_hex,session_nonce,server_session_pubkey,client_session_seckey);var txtdata=nacl.decode_utf8(crypt_bin)}else{txtdata=null}}return txtdata};zchan=function(usercrypto,step,txtdata){var encdata=ychan_encode(usercrypto,step,zchan_encode(usercrypto,step,txtdata));return"z/"+encdata};zchan_obj=function(usercrypto,step,encdata){try{return JSON.parse(zchan_decode(usercrypto,step,encdata))}catch(err){return false}};zchan_encode=function(usercrypto,step,txtdata){return LZString.compressToEncodedURIComponent(txtdata)};zchan_decode=function(usercrypto,step,encdata){return LZString.decompressFromEncodedURIComponent(ychan_decode(usercrypto,step,encdata))};fromInt=function(input,factor){var f=Number(factor);var x=new Decimal(String(input));return x.times((f>1?"0."+new Array(f).join("0"):"")+"1")};toInt=function(input,factor){var f=Number(factor);var x=new Decimal(String(input));return x.times("1"+(f>1?new Array(f+1).join("0"):""))};formatFloat=function(n){return String(Number(n))};isToken=function(symbol){return symbol.indexOf(".")!==-1?1:0};activate=function(code){if(typeof code=="string"){const{JSDOM:JSDOM}=jsdom;var dom=new JSDOM("",{runScripts:"outside-only"}).window;dom.window.nacl=nacl;dom.window.crypto=crypto;dom.window.logger=logger;dom.eval("var deterministic = (function(){})(); "+code+";");return dom.window.deterministic}else{console.log("Cannot activate deterministic code!");return function(){}}};init_asset=function(entry,fullmode){var mode=fullmode.split(".")[0];if(typeof assets.modehashes[mode]!="undefined"){storage.Get(assets.modehashes[mode]+".LOCAL",function(dcode){if(dcode){deterministic=activate(LZString.decompressFromEncodedURIComponent(dcode));assets.mode[entry]=fullmode;assets.seed[entry]=deterministic_seed_generator(entry);assets.keys[entry]=deterministic.keys({symbol:entry,seed:assets.seed[entry]});assets.addr[entry]=deterministic.address(assets.keys[entry]);var loop_step=next_step();hybriddcall({r:"a/"+entry+"/factor",c:GL.usercrypto,s:loop_step,z:0},0,function(object){if(typeof object.data!="undefined"){assets.fact[entry]=object.data}});var loop_step=next_step();hybriddcall({r:"a/"+entry+"/fee",c:GL.usercrypto,s:loop_step,z:0},0,function(object){if(typeof object.data!="undefined"){assets.fees[entry]=object.data}});var loop_step=next_step();hybriddcall({r:"a/"+entry+"/contract",c:GL.usercrypto,s:loop_step,z:0},0,function(object){if(typeof object.data!="undefined"){assets.cntr[entry]=object.data}});return true}else{storage.Del(assets.modehashes[mode]+".LOCAL")}if(!dcode){hybriddcall({r:"s/deterministic/code/"+mode,z:0},null,function(object){if(typeof object.error!=="undefined"&&object.error===0){storage.Set(assets.modehashes[mode]+".LOCAL",object.data);deterministic=activate(LZString.decompressFromEncodedURIComponent(object.data));assets.mode[entry]=fullmode;assets.seed[entry]=deterministic_seed_generator(entry);assets.keys[entry]=deterministic.keys({symbol:entry,seed:assets.seed[entry]});assets.addr[entry]=deterministic.address(assets.keys[entry]);var loop_step=next_step();hybriddcall({r:"a/"+entry+"/factor",c:GL.usercrypto,s:loop_step,z:0},0,function(object){if(typeof object.data!="undefined"){assets.fact[entry]=object.data}});var loop_step=next_step();hybriddcall({r:"a/"+entry+"/fee",c:GL.usercrypto,s:loop_step,z:0},0,function(object){if(typeof object.data!="undefined"){assets.fees[entry]=object.data}});var loop_step=next_step();hybriddcall({r:"a/"+entry+"/contract",c:GL.usercrypto,s:loop_step,z:0},0,function(object){if(typeof object.data!="undefined"){assets.cntr[entry]=object.data}})}});return true}})}};function deterministic_seed_generator(asset){var salt="1nT3rN3t0Fc01NsB1nD5tH3cRyPt05Ph3R3t093Th3Rf0Rp30Pl3L1k3M34nDy0U";function xorEntropyMix(key,str){var c="";var k=0;for(i=0;i<str.length;i++){c+=String.fromCharCode(str[i].charCodeAt(0).toString(10)^key[k].charCodeAt(0).toString(10));k++;if(k>=key.length){k=0}}return c}return UrlBase64.Encode(xorEntropyMix(nacl.to_hex(GL.usercrypto.user_keys.boxPk),xorEntropyMix(asset.split(".")[0],xorEntropyMix(salt,nacl.to_hex(GL.usercrypto.user_keys.boxSk))))).slice(0,-2)}hybriddcall=function(properties,element,postfunction,waitfunction){if(typeof properties.r=="undefined"){if(typeof this.vars.postfunction=="function"){this.vars.postfunction({object:{properties:properties}})}}var urltarget=properties.r;var usercrypto=GL.usercrypto;var step=next_step();var reqmethod=typeof properties.z!="undefined"&&!properties.z?0:1;if(!element){element="#NULL"}var urlrequest=nodepath+(reqmethod?zchan(usercrypto,step,urltarget):ychan(usercrypto,step,urltarget));var varsmain={properties:properties,element:element,postfunction:postfunction,waitfunction:waitfunction};najax({url:urlrequest,timeout:3e4,success:function(encobject){var object=reqmethod?zchan_obj(usercrypto,step,encobject):ychan_obj(usercrypto,step,encobject);if(object===false){UI.text[element].setContent("?")}else{if(object==null){object={}}object.properties=properties;var element=this.vars.element;if(typeof UI.text[element]!=="undefined"&&UI.text[element].getText()==="?"){spinnerStart(element)}hybriddproc(element,object,this.vars.postfunction,this.vars.waitfunction,0)}}.bind({vars:varsmain}),error:function(object){spinnerStop(element);UI.text[element].setContent("[read error!]");if(typeof this.vars.postfunction=="function"){var pass=typeof this.vars.properties.pass!="undefined"?this.vars.properties.pass:null;this.vars.postfunction(object,pass)}}.bind({vars:varsmain})});function hybriddproc(element,procobj,postfunction,waitfunction,cnt){if(cnt){if(cnt<10){cnt++}}else{cnt=1}var urltarget=procobj.properties.r;var usercrypto=GL.usercrypto;var proc_step=next_step();var reqmethod=typeof procobj.properties.z!="undefined"&&!procobj.properties.z?0:1;if(typeof procobj.data!="undefined"){var urlrequest=nodepath+(reqmethod?zchan(usercrypto,proc_step,"p/"+procobj.data):ychan(usercrypto,proc_step,"p/"+procobj.data));var varsproc={element:element,procobj:procobj,postfunction:postfunction,waitfunction:waitfunction,cnt:cnt};najax({url:urlrequest,timeout:3e4,success:function(result){var object=reqmethod?zchan_obj(usercrypto,proc_step,result):ychan_obj(usercrypto,proc_step,result);if(typeof object!="object"){object.progress=0}var cnt=this.vars.cnt;var element=this.vars.element;var procobj=this.vars.procobj;var postfunction=this.vars.postfunction;var waitfunction=this.vars.waitfunction;if(object.progress<1&&object.stopped==null){setTimeout(function(element,procobj,postfunction,waitfunction,cnt){hybriddproc(element,procobj,postfunction,waitfunction,cnt)},cnt*1e3,element,procobj,postfunction,waitfunction,cnt);if(typeof waitfunction=="function"){var pass=typeof procobj.properties.pass!="undefined"?procobj.properties.pass:null;waitfunction(object,pass)}}else{if(typeof postfunction=="function"){var pass=typeof procobj.properties.pass!="undefined"?procobj.properties.pass:null;object=postfunction(object,pass)}if(typeof object=="undefined"){object={}}if(typeof object.data!="undefined"){if(object.data==null){object.data="?"}if(object.data==0){object.data="0"}}else{object.data="?"}if(typeof UI.text[element]!=="undefined"){spinnerStop(element);UI.text[element].setContent(object.data);screen.render()}}}.bind({vars:varsproc}),error:function(object){spinnerStop(element);UI.text[element].setContent("?");if(typeof this.vars.postfunction=="function"){var pass;if(typeof this.vars.properties!=="undefined"){pass=typeof this.vars.properties.pass!=="undefined"?this.vars.properties.pass:null}else{pass=null}this.vars.postfunction(object,pass)}}.bind({vars:varsproc})})}}};