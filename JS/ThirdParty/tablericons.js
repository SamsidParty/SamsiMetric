/* 

Parts Of This File Was Extracted And Modified From https://tabler-icons.io/
It Contains Metadata For All The Icons In The Tabler Icon Pack
As It Is Relatively Large, It Should Only Be Loaded When Needed

MIT License

Copyright (c) 2020-2023 Pawet Kuna

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

//https://ramblings.mcpher.com/gassnippets2/converting-svg-to-png-with-javascript/#:~:text=The%20idea%20is%20to%20create,image%20and%20we're%20done.&text=var%20url%20%3D%20domUrl.,createObjectURL(svg)%3B
function GetIconAsPNG(svgText, margin, fill)
{

    return new Promise(function (resolve, reject)
    {
        try
        {

            var domUrl = window.URL || window.webkitURL || window;
            if (!domUrl)
            {
                throw new Error("Unsupported Browser")
            }


            var match = svgText.match(/height=\"(\d+)/m);
            var height = match && match[1] ? parseInt(match[1], 10) : 240;
            var match = svgText.match(/width=\"(\d+)/m);
            var width = match && match[1] ? parseInt(match[1], 10) : 240;
            margin = margin || 0;


            if (!svgText.match(/xmlns=\"/mi))
            {
                svgText = svgText.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
            }


            var canvas = document.createElement("canvas");
            canvas.width = height + margin * 2;
            canvas.height = width + margin * 2;
            var ctx = canvas.getContext("2d");



            var svg = new Blob([svgText], {
                type: "image/svg+xml;charset=utf-8"
            });

            var url = domUrl.createObjectURL(svg);

            var img = new Image;

            img.onload = function ()
            {
                ctx.filter = 'invert(1)'
                ctx.drawImage(this, margin, margin);

                if (fill)
                {
                    var styled = document.createElement("canvas");
                    styled.width = canvas.width;
                    styled.height = canvas.height;
                    var styledCtx = styled.getContext("2d");
                    styledCtx.save();
                    styledCtx.fillStyle = fill;
                    styledCtx.fillRect(0, 0, canvas.width, canvas.height);
                    styledCtx.restore();
                    styledCtx.drawImage(canvas, 0, 0);
                    canvas = styled;
                }

                domUrl.revokeObjectURL(url);

                resolve(canvas.toDataURL());
            };

            img.src = url;

        } catch (err)
        {
            reject('Failed To Convert SVG To PNG ' + err);
        }
    });
};
