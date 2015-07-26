console.log('hey!!!');

var Test = React.createClass({
    render: function() {
        return (
            <div>{this.props.msg}</div>
        );
    }
});

React.render(
    <Test msg="React really works!" />,
    document.getElementById('content')
);