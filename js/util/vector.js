Util.Vector = (function() {
    return {
        magnitudeSquared: function(vec) {
            return vec[0] * vec[0] + vec[1] * vec[1];
        },
        
        magnitude: function(vec) {
            var len = vec[0] * vec[0] + vec[1] * vec[1]; 
            if (len < Number.EPSILON)
            {
                return 0;
            }
            return Math.sqrt(len);
        }, 

        normalized: function(vec) {
            var len = vec[0] * vec[0] + vec[1] * vec[1]; 
            if (len < Number.EPSILON)
            {
                return [0, 0];
            }
            len = Math.sqrt(len);
            return [vec[0] / len, vec[1] / len];
        },

        clampMagnitude: function(vec, minLen, maxLen) {
            var len = vec[0] * vec[0] + vec[1] * vec[1]; 
            var normalized = [0, 0];
            if (len < Number.EPSILON)
            {
                len = 0;
            }
            else
            {
                len = Math.sqrt(len);
                normalized = [vec[0] / len, vec[1] / len];
            }
            len = Math.max(minLen, Math.min(maxLen, len));
            normalized[0] *= len;
            normalized[1] *= len;
            return normalized;
        }
    };
})();
