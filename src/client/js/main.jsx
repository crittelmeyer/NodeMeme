var Test = React.createClass({
    render() {
        return (
            <div>{this.props.msg}</div>
        );
    }
});

var foo = 'babel';

React.render(
    <Test msg={`React really works! Or does it? ${foo}!!!`} />,
    document.getElementById('content')
);