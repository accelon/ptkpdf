import PDFDocument from 'pdfkit';
import hzpx from 'hzpx-engine/nodebundle.cjs';
import {nodefs} from 'ptk/nodebundle.cjs'
import  QRCode  from 'qrcode'

await nodefs;

const drawPolygon=(doc,polygon,x,y)=>{
  for (let i=0;i<polygon.length;i++) {
    const data=polygon[i].map(it=>{return [x+it.x/30,y+it.y/30]});
    doc.polygon(...data);
    doc.fillAndStroke('black');
    
  }
}
const testprint=async ()=>{
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream('output.pdf'));  
  
  // await hzpx.loadFont();
  // const svg=hzpx.drawPinx('初衤礻',{polygon:true});
  // let x=0,y=100;
  // svg.forEach(it=>{
  //   drawPolygon(doc,it,x,y)
  //   x+=60;
  // });

  const str=await QRCode.toString('1',{type:'svg'});
  const qrwidth=3,qry=3;
  let svgpath=str.match(/0" d="(.+?)"/)[1].replace(/[\d\.]+/g, (m)=>parseFloat(m)*qrwidth)
  
  svgpath=svgpath.replace(/M(\d+) (\d+)/g,(m,m1,m2)=>{
    return 'M'+m1+' '+(parseFloat(m2)+100)
  });
  console.log(svgpath)
  doc.lineWidth(qrwidth)
  doc.path(svgpath).stroke();

  doc
  .font('fonts/kaiu.ttf') //PalatinoBold.ttf
  .fontSize(32)
  .text('如是我聞，一時佛在舍衛國祇樹給孤獨園', 100, 100);

  doc
  .font('fonts/yumin.ttf') //PalatinoBold.ttf
  .fontSize(24)
  .text('法雲印經會', 400, 10);

  doc.end();
}
testprint();


/*
const fs = require('fs');
// (595.28 x 841.89)
	
const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('output.pdf'));

doc
  .fontSize(25)
  .text('Some text  with an embedded font!', 100, 100);

// Finalize PDF file
doc.end();
*/