let arr = [20, 12, 35, 11, 17, 9, 58, 23, 69, 21];

function bubbleSort(arr) {
  let n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;
      }
    }

    if (!swapped) {
      break;
    }
  }
}

bubbleSort(arr);

console.log("Array setelah diurutkan:", arr);
