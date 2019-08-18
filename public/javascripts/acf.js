var ACF = {
    calculate: function (frame) {
        let acf = [];
        for (let i = 0; i < frame.length; i++) {

            let arr1 = Array.prototype.slice.call(frame.slice(i, frame.length));
            let arr2 = Array.prototype.slice.call(frame.slice(0, frame.length - i));

            let inner = math.dot(arr1, arr2);
            acf.push(inner);
        }
        return acf;
    },
    genarator1: function (pcmdata) {
        const frame = 128;
        let going = true;
        let count = 0;
        let flag = false;
        let mark = [];
        let accfArr = [];

        while (going) {

            let frame_from = count * frame / 2;
            let frame_to = (count * frame / 2) + frame;
            let acf = ACF.calculate(pcmdata.slice(frame_from, frame_to));

            let idx = 0;

            for (let i = 0; i < acf.length; i++) {
                if ((acf[i + 1] - acf[i]) > 0) {
                    idx = i;
                    break;
                }
            }

            let adjAcf = [];
            Object.assign(adjAcf, acf);
            for (let i = 0; i <= idx; i++) {
                adjAcf[i] = -acf[0];
            }

            let adjIdx = adjAcf.indexOf(Math.max(...adjAcf)) - 10;

            let basaFrame = (4000 / adjIdx).toFixed(0);
            // console.log("第" + count + "個  frame_from:" + frame_from + ", frame_to:" + frame_to + ", adjIdx=" + adjIdx + ", basaFrame = " + basaFrame);
            if (basaFrame >= 400) {

                mark.push(count);
                if (mark.length >= 16 && !flag) {
                    // console.log("mark length:" + mark.length);
                    flag = !flag;
                    accfArr.push({
                        "start": count
                    });
                }
            } else {
                mark = [];
                flag = !flag;
                // console.log("reset mark:" + mark.length === 0);

                if (accfArr.length >= 1) {
                    accfArr[accfArr.length - 1]["end"] = count;
                }
            }

            count += 1;
            if (frame_to >= pcmdata.length) {
                going = false;
            }
        }

        return accfArr;
    },
    genarator2: function (pcmdata) {
        const frame = 128;
        let going = true;
        let count = 0;
        let flag = false;
        let mark = [];
        let accfArr = [];

        while (going) {

            let frame_from = count * frame / 2;
            let frame_to = (count * frame / 2) + frame;
            let acf = Plot.ACF(pcmdata.slice(frame_from, frame_to));

            let idx = 0;

            for (let i = 0; i < acf.length; i++) {
                if ((acf[i + 1] - acf[i]) > 0) {
                    idx = i;
                    break;
                }
            }

            let adjAcf = [];
            Object.assign(adjAcf, acf);
            for (let i = 0; i <= idx; i++) {
                adjAcf[i] = -acf[0];
            }

            let adjIdx = adjAcf.indexOf(Math.max(...adjAcf));

            let basaFrame = (4000 / adjIdx).toFixed(0);
            // console.log("第" + count + "個  frame_from:" + frame_from + ", frame_to:" + frame_to + ", adjIdx=" + adjIdx + ", basaFrame = " + basaFrame);
            if (basaFrame >= 400) {

                mark.push(count);
                if (mark.length >= 16 && !flag) {
                    console.log("mark length:" + mark.length);
                    flag = !flag;
                    accfArr.push({
                        "start": count
                    });
                }
            } else {
                mark = [];
                flag = !flag;
                // console.log("reset mark:" + mark.length === 0);

                if (accfArr.length >= 1) {
                    accfArr[accfArr.length - 1]["end"] = count;
                }
            }

            count += 1;
            if (frame_to >= pcmdata.length) {
                going = false;
            }
        }

        return accfArr;
    }
}
