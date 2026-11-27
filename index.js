/** SI planning calculations; nominal pitch may not equal a manufacturer's exact pitch. */
function positive(v,n){if(!Number.isFinite(v)||v<=0)throw new RangeError(`${n} must be finite and positive`);}
export const PITCHES_MM=Object.freeze([1.2,1.5,1.8,2.5]);
export function resolution(widthMm,heightMm,pitchMm){
 for(const [n,v] of Object.entries({widthMm,heightMm,pitchMm}))positive(v,n);
 const exactWidth=widthMm/pitchMm,exactHeight=heightMm/pitchMm;
 if(Math.max(exactWidth,exactHeight)>Number.MAX_SAFE_INTEGER)throw new RangeError('Resolution exceeds safe integer precision');
 return {widthPx:Math.round(exactWidth),heightPx:Math.round(exactHeight),exactWidthPx:exactWidth,exactHeightPx:exactHeight,nominal:!Number.isInteger(exactWidth)||!Number.isInteger(exactHeight)};
}
export function cabinetGrid(widthMm,heightMm,cabinetWidthMm,cabinetHeightMm){
 for(const [n,v] of Object.entries({widthMm,heightMm,cabinetWidthMm,cabinetHeightMm}))positive(v,n);
 const columns=Math.ceil(widthMm/cabinetWidthMm),rows=Math.ceil(heightMm/cabinetHeightMm);
 if(!Number.isSafeInteger(columns*rows))throw new RangeError('Cabinet count exceeds safe integer precision');
 return {columns,rows,count:columns*rows,widthMm:columns*cabinetWidthMm,heightMm:rows*cabinetHeightMm,aspectRatio:columns*cabinetWidthMm/(rows*cabinetHeightMm)};
}
export function layout16x9(cabinetWidthMm,cabinetHeightMm,minWidthMm){
 for(const [n,v] of Object.entries({cabinetWidthMm,cabinetHeightMm,minWidthMm}))positive(v,n);
 for(let rows=1;rows<=10000;rows++){
  const columns=Math.round(16*rows*cabinetHeightMm/(9*cabinetWidthMm));
  if(columns<1||columns*cabinetWidthMm<minWidthMm)continue;
  const widthMm=columns*cabinetWidthMm,heightMm=rows*cabinetHeightMm;
  if(Math.abs(widthMm/heightMm-16/9)<1e-10)return {columns,rows,count:columns*rows,widthMm,heightMm};
 }
 throw new RangeError('No exact 16:9 layout within 10,000 rows; select other cabinets or an approximate aspect ratio');
}
export function viewingDistances(pitchMm,minimumFactorMPerMm=1){
 positive(pitchMm,'pitchMm');positive(minimumFactorMPerMm,'minimumFactorMPerMm');
 return {minimumViewingDistanceM: pitchMm*minimumFactorMPerMm, minimumBasis:'User-adjustable screening heuristic, default 1 metre per millimetre; not a visibility or readability guarantee',visualAcuityDistanceM: (pitchMm/1000)/Math.tan(Math.PI/(180*60))};
}
export function power(widthMm,heightMm,maxWPerM2,typicalWPerM2=null){
 for(const [n,v] of Object.entries({widthMm,heightMm,maxWPerM2}))positive(v,n);
 if(typicalWPerM2!==null){positive(typicalWPerM2,'typicalWPerM2');if(typicalWPerM2>maxWPerM2)throw new RangeError('Typical power cannot exceed maximum');}
 const areaM2=widthMm*heightMm/1e6;
 return {areaM2,maxW:areaM2*maxWPerM2,typicalW:typicalWPerM2===null?null:areaM2*typicalWPerM2};
}
