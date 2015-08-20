/**
 * This custom lint rule checks {...this.props} spread statements to make sure they are the
 * first attribute listed in a list of attributes.
 *
 * NOTE: It's a bit naive in its implementation - it checks for "{...self.props}" and "{...this.props}"
 * with simple string comparisons - so if "this" is set to a var other than self, it won't catch it - but
 * that should be ok for us, for as long as we stick with the "self" convention when aliasing "this".
 */

'use strict';

module.exports = function(context) {

    var MESSAGE = '{...this.props} should be the first attribute listed, to avoid accidental overwrites.';

    return {
        'JSXSpreadAttribute': function(node) {
            var breaksRule = false;
            var src = context.getSource(node);
            if (src === '{...this.props}' || src === '{...self.props}') {
                var elementSrc = context.getSource(node.parent);

                //split our code block into lines of attributes (and the element start tag)
                var lineArray = elementSrc.replace(/\n/g, ' ').replace(/\s+/g, ' ').split(' ').map(function(line) {
                    return line.trim();
                });

                //determine line number of props spread attribute
                var lineNum = lineArray.indexOf(src);

                //loop through attributes prior to spread attribute and flag breaksRule
                //if they have attribute syntax.
                for (var i = 0; i < lineNum; i++) {
                    var regex = /(\w+=((\"[^\"]+\")|(\{[^\}]+\})))+/;
                    if (regex.test(lineArray[i])) {
                        breaksRule = true;
                        break;
                    }
                }

                if (breaksRule === true) {
                    context.report(node, MESSAGE);
                }
            }
        }
    };
};
