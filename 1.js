function Hitungbarang(kualitas, qty) {
  let harga_per_barang;
  let potongan = 0;
  let total_harga;
  let total_potongan;
  let total_yang_harus_dibayar;

  if (kualitas === "A") {
    harga_per_barang = 4550;
    if (qty > 13) {
      potongan = 231 / qty;
    }
  } else if (kualitas === "B") {
    harga_per_barang = 5330;
    if (qty > 7) {
      potongan = 0.23;
    }
  } else if (kualitas === "C") {
    harga_per_barang = 8653;
    potongan = 0;
  } else {
    return "Kualitas barang tidak valid";
  }

  total_harga = harga_per_barang * qty;

  if (kualitas === "A" && qty > 13) {
    total_potongan = potongan * qty;
  } else if (kualitas === "B" && qty > 7) {
    total_potongan = total_harga * potongan;
  } else {
    total_potongan = total_harga * potongan;
  }

  total_yang_harus_dibayar = total_harga - total_potongan;

  return {
    "Total harga barang": total_harga,
    Potongan: total_potongan,
    "Total yang harus dibayar": total_yang_harus_dibayar,
  };
}

let result = Hitungbarang("A", 14);
console.log("Total harga barang:", result["Total harga barang"]);
console.log("Potongan:", result["Potongan"]);
console.log("Total yang harus dibayar:", result["Total yang harus dibayar"]);
