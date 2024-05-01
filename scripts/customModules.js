
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
    //more functions get added here

}
