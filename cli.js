#!/usr/bin/env node
import {resolution,cabinetGrid,layout16x9,viewingDistances,power} from './index.js';
const usage='Usage: node cli.js widthMm heightMm pitchMm cabinetWidthMm cabinetHeightMm maxWPerM2 [typicalWPerM2]';
if(process.argv.includes('--help')){console.log(usage);process.exit(0);}
try{
 const raw=process.argv.slice(2); if(raw.length<6||raw.length>7)throw new Error(usage);
 const [w,h,p,cw,ch,max,typical]=raw.map(Number);
 const grid=cabinetGrid(w,h,cw,ch);
 let exact16x9;try{exact16x9=layout16x9(cw,ch,w);}catch(e){exact16x9={unavailable:e.message};}
 const result={requestedResolution:resolution(w,h,p),cabinetGrid:grid,installedResolution:resolution(grid.widthMm,grid.heightMm,p),exact16x9,viewing: viewingDistances(p),installedPower:power(grid.widthMm,grid.heightMm,max,typical??null),note:'Nominal geometry only. Confirm actual cabinet pixel matrix, exact pitch, maximum input power and electrical design with the supplier.'};
 console.log(JSON.stringify(result,null,2));
}catch(e){console.error(e.message);process.exitCode=1;}
