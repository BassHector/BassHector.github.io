
export class customFunctions {
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    static relativePercentage(baseValue, totalBase, targetValue) {
        if (totalBase === 0) { // Prevent division by zero
            return 0;
        }
        const percentage = (baseValue / totalBase) * 100;
        const result = (percentage / 100) * targetValue;
        return Math.floor(result);
    }

    static rangeBetween(num1, num2) {
        const start = Math.min(num1, num2);
        const end = Math.max(num1, num2);
        const rangeArray = [];

        for (let i = start; i <= end; i++) {
            rangeArray.push(i);
        }

        return rangeArray;
    }

    static rangeOutside(min, num1, num2, max) {
        const numbersOutside = [];
        // Loop from min to max
        for (let i = min; i <= max; i++) {
            // Include numbers that are not between num1 and num2 (inclusive)
            if (i < num1 || i > num2) {
                numbersOutside.push(i);
            }
        }

        return numbersOutside;
    }

    static cumulativeIntArray(someArray) {
        let addToArray = [];
        let cumulativeSum = 0;

        someArray.forEach((num) => {
            cumulativeSum += num;
            addToArray.push(cumulativeSum);
        });

        return addToArray;
    }
    //more functions get added here

}
