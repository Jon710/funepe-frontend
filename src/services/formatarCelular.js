/* eslint-disable no-console */
export default function validatePhone(phone) {
  // const phoneRE = new RegExp(
  //   '^\\([0-9]{3}\\)((3[0-9]{4}-[0-9]{4})|(9[0-9]{5}-[0-9]{4}))$'
  // );
  // return phoneRE.test(phone);
  let phoneFmt = phone;
  console.log(Object.keys(phoneFmt).length);
  // 014981147059
  if (Object.keys(phoneFmt).length === 12) {
    const parte0 = phoneFmt.toString().slice(0, 3);
    const parte1 = phoneFmt.toString().slice(3, 8);
    const parte2 = phoneFmt.toString().slice(8, 12);
    phoneFmt = `(${parte0})${parte1}-${parte2}`;
  } else {
    const parte0 = phoneFmt.toString().slice(0, 3);
    const parte1 = phoneFmt.toString().slice(3, 7);
    const parte2 = phoneFmt.toString().slice(7, 11);
    phoneFmt = `(${parte0})${parte1}-${parte2}`;
  }

  return phoneFmt;
}
