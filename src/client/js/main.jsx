/*

	Copied, pasted and edited code from react-router example. To refine later

 */


var { Route, DefaultRoute, RouteHandler, Link } = ReactRouter;

var App = React.createClass({
  getInitialState: function () {
    return { memes: getAllMemes() };
  },

  // App's render function
  render: function () {
    
  	// Set up links to other memes
    var links = this.state.memes.map(function (meme) {
      
      return (
        <li key={meme.name}>
        
          <Link

            to="memes-detail"

            params={{ name: meme.name.toLowerCase().replace(/\s/g, "_") }}
          >
          	{meme.name}
          </Link>
        </li>
      );
    });

    // Return app's view to render function
    return (
      <div className="App">
        <div className="Detail">
          <RouteHandler/>
        </div>
        <ul className="Master">
          {links}
        </ul>
      </div>
    );
  }
});


/* Index */
var Index = React.createClass({
  render: function () {
    return <p>Select a meme below</p>;
  }
});


/* Meme Class */
var Meme = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  imageUrl: function (name) {
  	// Replace spaces in name with underscore
  	var encodedName = name.replace(/\s/g, "_");

  	// Return memes path with encoded name
    return "../images/memes/" + encodedName + ".jpg";
  },

  render: function () {

  	// Grab meme based on name from params.name
    var meme = getMeme(this.context.router.getCurrentParams().name);

    return (
      <div className="Meme">
        <h3>{meme.name}</h3>
        <img src={this.imageUrl(meme.name)}/>
      </div>
    );
  }
});

var routes = (
  <Route handler={App}>
    <DefaultRoute handler={Index}/>
    <Route name="memes-detail" path="memes/:name" handler={Meme}/>
  </Route>
);

ReactRouter.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('content'));
});

/*****************************************************************************/
// methods


// Get one meme
function getMeme(name) {
  
  // Normalize name
  name = name.replace(/\_/g, " ").toLowerCase();

  // Create meme to return 
  var memeToReturn;
  
  // Cache all memes
  var memes = getAllMemes();
  
  // For each meme
  memes.forEach(function(meme) {

  	// If meme.name matches name paramter, return meme
  	if (meme.name.toLowerCase() === name) {
  		
  		// Set meme to return as current meme
  		memeToReturn = meme;
  	}
  });

  // Return meme
  return memeToReturn;
}

// Mockup of meme data
function getAllMemes() {
  return [
    {
    	name: "Tucker"
    },
    {
    	name: "Bad Luck Brian"
    }
  ];
}