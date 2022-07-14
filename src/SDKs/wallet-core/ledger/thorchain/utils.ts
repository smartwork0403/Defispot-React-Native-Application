import {fromByteArray} from 'base64-js';

export const recursivelyOrderKeys = (unordered: any) => {
  // If it's an array - recursively order any
  // dictionary items within the array
  if (Array.isArray(unordered)) {
    unordered.forEach((item, index) => {
      unordered[index] = recursivelyOrderKeys(item);
    });
    return unordered;
  }

  // If it's an object - let's order the keys
  if (typeof unordered === 'object') {
    const ordered: any = {};
    Object.keys(unordered)
      .sort()
      .forEach(key => {
        ordered[key] = recursivelyOrderKeys(unordered[key]);
      });
    return ordered;
  }

  return unordered;
};

export const stringifyKeysInOrder = (data: any) => {
  const sortedData = recursivelyOrderKeys(data);
  return JSON.stringify(sortedData);
};

export const orderJSON = (data: any) => {
  const sortedData = recursivelyOrderKeys(data);
  return sortedData;
};

export const getSignature = (signatureArray: any) => {
  if (signatureArray.length < 64) {
    throw Error('Invalid Signature: Too short');
  }
  if (signatureArray[0] !== 0x30) {
    throw Error(
      'Invalid Ledger Signature TLV encoding: expected first byte 0x30',
    );
  }
  if (signatureArray[1] + 2 !== signatureArray.length) {
    throw Error('Invalid Signature: signature length does not match TLV');
  }
  if (signatureArray[2] !== 0x02) {
    throw Error(
      'Invalid Ledger Signature TLV encoding: expected length type 0x02',
    );
  }

  // r signature
  const rLength = signatureArray[3];
  let rSignature = signatureArray.slice(4, rLength + 4);

  // Drop leading zero on some 'r' signatures that are 33 bytes.
  if (rSignature.length === 33 && rSignature[0] === 0) {
    rSignature = rSignature.slice(1, 33);
  } else if (rSignature.length === 33) {
    throw Error('Invalid signature: "r" too long');
  }

  // add leading zero's to pad to 32 bytes
  while (rSignature.length < 32) {
    rSignature.unshift(0);
  }

  // s signature
  if (signatureArray[rLength + 4] !== 0x02) {
    throw Error(
      'Invalid Ledger Signature TLV encoding: expected length type 0x02',
    );
  }

  const sLength = signatureArray[rLength + 5];

  if (4 + rLength + 2 + sLength !== signatureArray.length) {
    throw Error(
      'Invalid Ledger Signature: TLV byte lengths do not match message length',
    );
  }

  let sSignature = signatureArray.slice(rLength + 6, signatureArray.length);

  // Drop leading zero on 's' signatures that are 33 bytes. This shouldn't occur since ledger signs using "Small s" math. But just to be sure...
  if (sSignature.length === 33 && sSignature[0] === 0) {
    sSignature = sSignature.slice(1, 33);
  } else if (sSignature.length === 33) {
    throw Error('Invalid signature: "s" too long');
  }

  // add leading zero's to pad to 32 bytes
  while (sSignature.length < 32) {
    sSignature.unshift(0);
  }

  if (rSignature.length !== 32 || sSignature.length !== 32) {
    throw Error('Invalid signatures: must be 32 bytes each');
  }

  return fromByteArray(Buffer.concat([rSignature, sSignature]));
};
