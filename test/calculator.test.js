import test from 'node:test';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';
import {resolution,cabinetGrid,layout16x9,viewingDistances,power,PITCHES_MM} from '../index.js';
test('all requested pitch options produce known nominal resolutions',()=>{
 for(const p of PITCHES_MM){const r=resolution(4800,2700,p);assert.equal(r.widthPx,Math.round(4800/p));assert.equal(r.heightPx,Math.round(2700/p));}
 assert.equal(resolution(4800,2700,1.25).widthPx,3840);
 assert.equal(resolution(4800,2700,1.8).nominal,true);
});
test('cabinet grid rounds up; installed dimensions determine power',()=>{
 const g=cabinetGrid(3100,1700,600,337.5);assert.deepEqual([g.columns,g.rows,g.count,g.widthMm,g.heightMm],[6,6,36,3600,2025]);
 assert.equal(power(g.widthMm,g.heightMm,600,200).maxW,4374);
 assert.equal(power(1000,1000,600).typicalW,null);
});
test('exact 16:9 uses cabinet geometry, including non-16:9 cabinets',()=>{
 assert.deepEqual(layout16x9(600,337.5,3000),{columns:5,rows:5,count:25,widthMm:3000,heightMm:1687.5});
 const g=layout16x9(500,500,3000);assert.equal(g.columns,16);assert.equal(g.rows,9);
});
test('viewing distances distinguish screening from 1 arcminute geometry',()=>{
 assert.equal(viewingDistances(2.5).minimumViewingDistanceM,2.5);
 assert.ok(Math.abs(viewingDistances(2.5).visualAcuityDistanceM-8.594)<0.001);
});
test('invalid, nonfinite, impossible power inputs are rejected',()=>{
 for(const v of [0,-1,NaN,Infinity,'3'])assert.throws(()=>resolution(v,1000,1.5));
 assert.throws(()=>power(1000,1000,100,200));assert.throws(()=>cabinetGrid(1e30,1e30,1,1));
});
test('CLI returns JSON for a real example and nonzero on invalid input',()=>{
 const cwd=new URL('..',import.meta.url);const ok=spawnSync(process.execPath,['cli.js','4800','2700','1.25','600','337.5','600','200'],{cwd,encoding:'utf8'});
 assert.equal(ok.status,0);assert.equal(JSON.parse(ok.stdout).installedResolution.widthPx,3840);
 const bad=spawnSync(process.execPath,['cli.js','bad','2700','1.5','600','337.5','600'],{cwd,encoding:'utf8'});assert.equal(bad.status,1);
});
