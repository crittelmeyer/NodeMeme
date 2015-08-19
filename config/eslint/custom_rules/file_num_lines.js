/**
 * This custom lint rule checks for files with greater than a specified number of lines (default 500)
 */

'use strict';

module.exports = function(context) {

    var MESSAGE = 'File too long ({{gotten}} lines - should be less than {{needed}}).';

    var maxLines = +(context.options[0] || 500);

    return {
        'Program': function (node) {
            var lines = context.getSourceLines();
            var numLines = lines.length;
            var allowanceKeyword = 'num_lines';
            var comments = lines.filter(function(line) {
                return line.indexOf('/* ' + allowanceKeyword) > -1;
            });

            //check for comments that tell us to increment the max num lines allowed
            if (comments.constructor === Array && comments.length > 0) {
                comments.forEach(function(comment) {
                    var numLinesCommentIndex = comment.indexOf(allowanceKeyword);
                    var newMaxLinesStartIndex,
                        newMaxLinesEndIndex,
                        newMaxLines;

                    if (numLinesCommentIndex > -1) {
                        newMaxLinesStartIndex = numLinesCommentIndex + allowanceKeyword.length + 1;
                        newMaxLinesEndIndex = comment.length - 3;
                        newMaxLines = comment.substring(newMaxLinesStartIndex, newMaxLinesEndIndex);
                        maxLines = parseInt(newMaxLines);
                    }
                });
            }

            //check to make sure number of lines is less than max allowed
            if (numLines > maxLines) {
                context.report(node, MESSAGE, { gotten: numLines, needed: maxLines });
            }

        }
    };
};
