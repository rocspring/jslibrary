JSR.once(function() {
    var window = this;
    
    this.RD.ChapterSplit = function ( content, windowWidth, windowHeight, paragraphSpacing, fontSize, lineHeight ) {

        //把传入的content分割成一个p标签数组
        var splitContent = function (content) {
            var str = content || '',
                tempArray = str.split('</p>'),
                length,
                i;

            tempArray.length = tempArray.length - 1;
            for( i = 0, length = tempArray.length; i < length; i++ ){
                tempArray[i] += '</p>';
            }
            return tempArray;
        };

        //计算一个p标签的实际高度
        var countTagPHeight = function (str) {
            if ( !/<p>(.*?)<\/p>/i.test(str) ) {return;}

            var pHeight,
                tempArr = divideContentToRows(str);

            if( str.replace(/(<p[^>]*>)|(<\/p>)/ig, '') === '' ) {
                pHeight = 0;
            }else {
                pHeight = tempArr.length * lineHeight ;
            }
            return pHeight;
        };
       
        //把一段文字进行分行,返回分好行的字符串数组
        var divideContentToRows = function (content) {
            var str = content || '',
                tempArray = str.replace(/(<p[^>]*>)|(<\/p>)/ig, '').split(''),
                length = tempArray.length,
                isHaveEnglishChart = false,
                englishChartNum = 0,
                tempLength,
                tempStr = '',
                splitRowArray = [],
                i;

            tempLength = ( /<p>/i.test(str) ) ? textIndent : 0;

            for( i = 0; i < length; i++ ){
                if (!tempStr && tempLength === null) {
                    // 华为D2的QQ浏览器，如果tempLength直接赋值0，则会变成无穷小
                    tempLength = 0;
                }

                tempStr += tempArray[i];

                if ( /[^\u0000-\u00FF]/.test(tempArray[i]) ) {
                    tempLength += fontSize;
                    isHaveEnglishChart = false;
                }else{
                    englishChartNum++;
                    tempLength += fontSize/2;
                    isHaveEnglishChart = true;
                }

                if( ( ( tempLength === windowWidth - fontSize / 2) && englishChartNum % 2 === 1 && ( /[^\u0000-\u00FF]/.test(tempArray[i+1]) ) && i !== length - 1 ) || ( tempLength === windowWidth && englishChartNum % 2 === 0 ) || ( tempLength < windowWidth && i === length - 1 ) ){
                    splitRowArray.push(tempStr);
                    englishChartNum = 0;

                    // 华为D2的QQ浏览器，如果tempLength直接赋值0，则会变成无穷小
                    tempLength = null;
                    tempStr = '';
                }
            }

            return splitRowArray;
        };

        //当一个p标签是最后一个段落，且超过页面的高度时,进行拆分
        var spiltLastPTag = function ( content, maxHeight ) {
            content = content || '';

            var rowArray = divideContentToRows(content),
                cRowNum = rowArray.length,
                lastRowNum = Math.floor( maxHeight/lineHeight ),
                pRowNum = Math.floor( ( windowHeight - 1 * paragraphSpacing )/lineHeight ),
                //str = content.replace(/(<p[^>]*>)|(<\/p>)/ig, ''),
                dividLastPTagArray = [],
                i, length,
                tempStr = '';

            for ( i = 0, length = cRowNum; i < length ; i++ ){
                tempStr += rowArray[i];

                if ( i === lastRowNum - 1 ) {
                    dividLastPTagArray.push( '<p>' + tempStr + '</p>' );
                    tempStr = '';
                }else if( ( i - lastRowNum + 1 ) % pRowNum === 0 ){
                    dividLastPTagArray.push( '<p class="bf">' + tempStr + '</p>' );
                    tempStr = '';
                }else if( ( i === length - 1 ) && ( i - lastRowNum + 1 ) % pRowNum !== 0  ){
                    dividLastPTagArray.push( '<p class="bf">' + tempStr + '</p>' );
                    tempStr = '';
                }

            }

            return dividLastPTagArray;
        };

        windowWidth = Math.floor( windowWidth / fontSize ) * fontSize;
        content = content.replace(/\r\n/ig, '')
                          .replace(/(&quot;)/ig, '"')
                          .replace(/(&#34;)/ig, '"')
                          .replace(/(&apos;)/ig, "'")
                          .replace(/(&#39;)/ig, "'")
                          .replace(/(&amp;)/ig, '&')
                          .replace(/(&#38;)/ig, '&')
                          .replace(/(&lt;)/ig, '<')
                          .replace(/(&#60;)/ig, '<')
                          .replace(/(&gt;)/ig, '>')
                          .replace(/(&#62;)/ig, '>');

        var textIndent = 2 * fontSize,
            tagPArray, i, j, k,
            length,splitLastPTagArray,
            tempHeight = 1 * paragraphSpacing,
            tempStr = '',
            tempArray = [],
            heightArray = [],
            resultArray = [];

        if ( content === '' ) {
            resultArray[0] = '';
            return resultArray;
        }

        tagPArray = splitContent(content);

        //计算每个p标签的高度
        for( i = 0, length = tagPArray.length; i < length; i++ ){
            heightArray[i] = countTagPHeight(tagPArray[i]);
        }


        for( j = 0; j < length; j++ ){
            tempHeight += (heightArray[j] === 0) ? 0 : (heightArray[j] + paragraphSpacing);

            //当高度不够一页的情况下
            //（条件：高度不足一页+不是最后一个p标签+剩余的高度至少可以再放一行）
            if ( (tempHeight - paragraphSpacing < windowHeight) && 
                 (j !== length - 1) && 
                 (windowHeight - tempHeight >= lineHeight) ) {  
                tempStr += tagPArray[j];

            // 当高度超过一页的情况下
            //（条件：高度超过一页+上一次计算的剩余高度至少可以再放一行）
            }else if ( tempHeight - paragraphSpacing > windowHeight &&
                        windowHeight - tempHeight + heightArray[j] + paragraphSpacing >= lineHeight ) { 
                //TODO 分拆最后一个超过页面高度的p标签
                //windowHeight- (tempHeight - heightArray[j] - paragraphSpacing)
                splitLastPTagArray = spiltLastPTag( tagPArray[j], windowHeight - tempHeight + heightArray[j] + paragraphSpacing );
                tempStr += splitLastPTagArray[0];
                resultArray.push(tempStr);
                tempStr = '';
                tempHeight = 1 * paragraphSpacing;
                if ( splitLastPTagArray.length >= 3 ) {
                    for ( k=1; k <= splitLastPTagArray.length - 2; k++ ){
                        resultArray.push(splitLastPTagArray[k]);
                    }
                    tempStr += splitLastPTagArray[splitLastPTagArray.length - 1];
                    tempArray = divideContentToRows(splitLastPTagArray[splitLastPTagArray.length - 1]);
                    tempHeight += ( lineHeight * tempArray.length + paragraphSpacing );
                }else if ( splitLastPTagArray.length === 2 ){
                    tempStr += splitLastPTagArray[1];
                    tempArray = divideContentToRows(splitLastPTagArray[1]);
                    tempHeight +=  ( lineHeight * tempArray.length + paragraphSpacing );
                }
                if( j === length - 1) {resultArray.push(tempStr);} //是最后一个p元素，直接添加 一页

                 if ( windowHeight - tempHeight < lineHeight ) {
                    resultArray.push(tempStr);
                    tempHeight = 1 * paragraphSpacing;
                    tempStr = '';
                }

                //当高度刚好够一页的情况下
                //（条件： 高度小于窗口高度且剩余高度不够再放一行 || 高度大于窗口高度且高度减去添加的段间距后小于等于窗口高度 || 
                //  高度减去添加的段间距后小于窗口高度且是最后一个p标签 ）
            }else if( ( windowHeight - tempHeight < lineHeight && windowHeight - tempHeight >= 0 ) || 
                      ( tempHeight - paragraphSpacing <= windowHeight  && tempHeight - windowHeight >= 0 ) ||
                      ( tempHeight - paragraphSpacing < windowHeight && j === length - 1 ) ){  
                tempStr += tagPArray[j];
                resultArray.push(tempStr);
                tempHeight = 1 * paragraphSpacing;
                tempStr = '';
            }
        }

        return resultArray;
    };

    this.RD.calculateEachRowHeight = function ( content, windowWidth, paragraphSpacing, fontSize, lineHeight ) {
        content = content.replace(/\r\n/ig, '')
                          .replace(/(&quot;)/ig, '"')
                          .replace(/(&#34;)/ig, '"')
                          .replace(/(&apos;)/ig, "'")
                          .replace(/(&#39;)/ig, "'")
                          .replace(/(&amp;)/ig, '&')
                          .replace(/(&#38;)/ig, '&')
                          .replace(/(&lt;)/ig, '<')
                          .replace(/(&#60;)/ig, '<')
                          .replace(/(&gt;)/ig, '>')
                          .replace(/(&#62;)/ig, '>');

        var textIndent = 2 * fontSize,
            tagPArray, i, j,
            length,
            titleHeight = 46,
            resultArray = [];

        if ( content === '' ) {
            resultArray[0] = '';
            return resultArray;
        }
        tagPArray = splitContent(content);

        resultArray[0] = [];
        resultArray[0][0] = titleHeight; //标题的高度
        resultArray[0][1] = titleHeight; //
        //得到一个二维数组，第一列是每行的高度，第二列是前面所有行加起来的高度
        for( i = 0, length = tagPArray.length; i < length; i++ ){
            (function (i) {
                var temp = divideContentToRows(tagPArray[i]);
                for (var j = 0, tempLength = temp.length; j < tempLength; j++) {
                    resultArray[resultArray.length] =[];
                    resultArray[resultArray.length - 1][0] = temp[j];
                    resultArray[resultArray.length - 1][1] = resultArray[ resultArray.length - 2 ][1] + lineHeight;
                }
            })(i);

            if ( divideContentToRows(tagPArray[i]).length > 0 ) {
                resultArray[resultArray.length] =[];
                resultArray[resultArray.length - 1 ][0] = '';
                resultArray[resultArray.length - 1 ][1] = resultArray[ resultArray.length - 2 ][1] + paragraphSpacing;
            }  
        }

        return resultArray;


        //把传入的content分割成一个p标签数组
        function splitContent (content) {
            var str = content || '',
                tempArray = str.split('</p>'),
                length,
                i;

            tempArray.length = tempArray.length - 1;
            for( i = 0, length = tempArray.length; i < length; i++ ){
                tempArray[i] += '</p>';
            }
            return tempArray;
        }

        //把一段文字进行分行,返回分好行的字符串数组
        function divideContentToRows (content) {
            var str = content || '',
                tempArray = str.replace(/(<p[^>]*>)|(<\/p>)/ig, '').split(''),
                length = tempArray.length,
                isHaveEnglishChart = false,
                tempLength,
                tempStr = '',
                splitRowArray = [],
                i, nextCharLenght;

            tempLength = ( /<p>/i.test(str) ) ? textIndent : 0;

            for( i = 0; i < length; i++ ){
                if (!tempStr && tempLength === null) {
                    // 华为D2的QQ浏览器，如果tempLength直接赋值0，则会变成无穷小
                    tempLength = 0;
                }

                tempStr += tempArray[i];

                //区分汉字和其他字符
                if ( /[\u4e00-\u9fa5]/.test(tempArray[i]) ) {
                    tempLength += fontSize;
                    isHaveEnglishChart = false;
                }else{
                    // tempLength += fontSize/2;
                    tempLength += calculateChartRealyLength(tempArray[i]);
                    isHaveEnglishChart = true;
                }
               
                 nextCharLenght = ( /[\u4e00-\u9fa5]/.test(tempArray[i + 1]) ) ? fontSize : calculateChartRealyLength(tempArray[i+1]);
                //不够一行，但是加上下一个字符超过一行 + 刚好够一行 +刚好是最后一行             
                if( (tempLength + nextCharLenght > windowWidth) ||  tempLength === windowWidth || ( tempLength <= windowWidth && i === length - 1 ) ) { 
                    splitRowArray.push(tempStr);
                    // 华为D2的QQ浏览器，如果tempLength直接赋值0，则会变成无穷小
                    tempLength = null;
                    tempStr = '';
                }
            }

            return splitRowArray;
        }

        //计算一个字符的实际长度(处理除汉字外的其他字符)
        //汉字：[\u4e00-\u9fa5]，全角字符：[^\u0000-\u00FF]
        function calculateChartRealyLength (chart) {
            //全角字符
            if( /[^\u0000-\u00FF]/.test(chart) ){ 
                return /“|”|‘|’|—|…/.test(chart) ? fontSize * 0.6 : fontSize;          
            }else{
                return fontSize * 0.6;
            }
        }        
                      
    };
     
});