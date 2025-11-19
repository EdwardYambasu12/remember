
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const cors = require("cors");
const bodyParser = require('body-parser');
const crypto = require('crypto');


router.use(cors());
router.use(bodyParser.json());
router.use(express.urlencoded({ extended: true }));

const h = `[Spoken Intro: Alan Hansen & Trevor Brooking]
I think it's bad news for the English game
We're not creative enough, and we're not positive enough

[Refrain: Ian Broudie & Jimmy Hill]
It's coming home, it's coming home, it's coming
Football's coming home (We'll go on getting bad results)
It's coming home, it's coming home, it's coming
Football's coming home
It's coming home, it's coming home, it's coming
Football's coming home
It's coming home, it's coming home, it's coming
Football's coming home

[Verse 1: Frank Skinner]
Everyone seems to know the score, they've seen it all before
They just know, they're so sure
That England's gonna throw it away, gonna blow it away
But I know they can play, 'cause I remember

[Chorus: All]
Three lions on a shirt
Jules Rimet still gleaming
Thirty years of hurt
Never stopped me dreaming

[Verse 2: David Baddiel]
So many jokes, so many sneers
But all those "Oh, so near"s wear you down through the years
But I still see that tackle by Moore and when Lineker scored
Bobby belting the ball, and Nobby dancing

[Chorus: All]
Three lions on a shirt
Jules Rimet still gleaming
Thirty years of hurt
Never stopped me dreaming

[Bridge]
England have done it, in the last minute of extra time!
What a save, Gordon Banks!
Good old England, England that couldn't play football!
England have got it in the bag!
I know that was then, but it could be again

[Refrain: Ian Broudie]
It's coming home, it's coming
Football's coming home
It's coming home, it's coming home, it's coming
Football's coming home
(England have done it!)
It's coming home, it's coming home, it's coming
Football's coming home
It's coming home, it's coming home, it's coming
Football's coming home
[Chorus: All]
(It's coming home) Three lions on a shirt
(It's coming home, it's coming) Jules Rimet still gleaming
(Football's coming home
It's coming home) Thirty years of hurt
(It's coming home, it's coming) Never stopped me dreaming
(Football's coming home
It's coming home) Three lions on a shirt
(It's coming home, it's coming) Jules Rimet still gleaming
(Football's coming home
It's coming home) Thirty years of hurt
(It's coming home, it's coming) Never stopped me dreaming
(Football's coming home
It's coming home) Three lions on a shirt
(It's coming home, it's coming) Jules Rimet still gleaming
(Football's coming home
It's coming home) Thirty years of hurt
(It's coming home, it's coming) Never stopped me dreaming
(Football's coming home)`.replace(/^\uFEFF/, '').trimEnd();

function md5Upper(str) {
  return crypto.createHash('md5').update(str, 'utf8').digest('hex').toUpperCase();
}

function generateSignature(url, code, foo) {
  const payload = {
    url: url,
    code: code,
    foo: foo
  };
  
  const canonical = JSON.stringify(payload);
  return md5Upper(canonical + h);
}

function generateXmasToken(urlPath, timestampMs = null) {
  if (timestampMs === null) {
    timestampMs = Date.now();
  }

  const payload = {
    url: urlPath,
    code: timestampMs,
    foo: "production:aa829cde317403e0e05d863c363f6220750d20b8"
  };

  const sig = generateSignature(urlPath, timestampMs, "production:aa829cde317403e0e05d863c363f6220750d20b8");
  
  const tokenObj = {
    body: payload,
    signature: sig
  };
  
  const jsonStr = JSON.stringify(tokenObj);
  const finalB64Token = Buffer.from(jsonStr, 'utf8').toString('base64');
  
  return finalB64Token;
}

function generateMatchesToken(date, timezone, ccode3) {
  const urlPath = `/api/data/matches?date=${date}&timezone=${timezone}&ccode3=${ccode3}`;
  return generateXmasToken(urlPath);
}

function generateMatchDetailsToken(matchId) {
  const urlPath = `/api/data/matchDetails?matchId=${matchId}`;
  return generateXmasToken(urlPath);
}

const uri = "mongodb+srv://sportsup14:a4gM6dGvo7SHk9aX@cluster0.db0ee.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(' connect to MongoDB', err));

const registerSchema = new mongoose.Schema({
  email: { type: String,  },
  password: { type: String, },
  favorite_team: [{ type: String }],
  favorite_player: [{ type: String }],
  favorite_league: [{ type: String }],
  pinned_matches: [{ type: String }],
  phone_string: { type: String }
});

const var_schema = new mongoose.Schema(
    {

      variable : {type : String},
      result_string : {type : String},
      comm : {type : String},
      m_news : {type : String},
      odds : {type:String},
      id: {type : String},
      token : {type : String}

    }
  )

const model_schema = mongoose.model("Vard", var_schema)

router.post("/generate-tokens", async(req, res) => {
  try {
    const date = req.body.date || new Date().toISOString().split('T')[0].replace(/-/g, '');
    const timezone = req.body.timezone || 'Africa%2FMonrovia';
    const ccode3 = req.body.ccode3 || 'LBR';
    const matchId = req.body.matchId || '4822533';
    
    const matchesToken = generateMatchesToken(date, timezone, ccode3);
    const matchDetailsToken = generateMatchDetailsToken(matchId);
    
    await model_schema.deleteMany({});
    
    const tokenData = new model_schema({
      variable: matchesToken,
      result_string: matchDetailsToken,
      comm: req.body.com || '',
      m_news: req.body.news_m || '',
      odds: req.body.m_odds || '',
      id: req.body.idm || '',
      token: req.body.tokenm || ''
    });
    
    await tokenData.save();
    
    res.json({
      success: true,
      message: 'Tokens generated and saved',
      tokens: {
        matches: matchesToken,
        matchDetails: matchDetailsToken
      },
      meta: {
        date: date,
        timezone: timezone,
        ccode3: ccode3,
        matchId: matchId,
        timestamp: Date.now()
      }
    });
    
  } catch (error) {
    console.error('Error generating tokens:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get current tokens
router.get("/get-tokens", async(req, res) => {
  try {
    const data = await model_schema.find();
    
    if (data.length === 0) {
      return res.json({
        success: false,
        message: 'No tokens found. Please generate tokens first.'
      });
    }
    
    res.json({
      success: true,
      tokens: {
        matches: data[0]["variable"],
        matchDetails: data[0]["result_string"]
      }
    });
    
  } catch (error) {
    console.error('Error getting tokens:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generate token for any custom URL path
router.post("/generate-custom-token", (req, res) => {
  try {
    const { urlPath, timestamp } = req.body;
    
    if (!urlPath) {
      return res.status(400).json({
        success: false,
        error: 'urlPath is required in request body'
      });
    }

    const finalTimestamp = timestamp || Date.now();
    const token = generateXmasToken(urlPath, finalTimestamp);
    
    res.json({
      success: true,
      token: token,
      meta: {
        urlPath: urlPath,
        timestamp: finalTimestamp
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post("/vari", async(req, res)=>{

  const {sport, resu, com, news_m, m_odds, idm, tokenm} = req.body
console.log(sport)

    const result = await model_schema .deleteMany({}); // Deletes all documents in the collection
    console.log('All users deleted:', result);
  const start = new model_schema({
      variable : sport,
      result_string : resu,
      comm : com,
      m_news : news_m,
      odds: m_odds,
      id : idm,
      token : tokenm
    }
            )
  await start.save()

})
router.get("/var", async(req, res)=>{
  const data = await model_schema.find()

  res.json(data)
})
const RegisterModel = mongoose.model("User", registerSchema);
router.get("/delete_all_users", async (req, res) => {
  try {
    const result = await register_model.deleteMany({}); // Deletes all documents in the collection
    console.log('All users deleted:', result);
    res.status(200).json({ message: 'All users deleted successfully', deletedCount: result.deletedCount });
  } catch (err) {
    console.error('Error deleting users:', err);
    res.status(500).json({ message: 'Error deleting users', error: err.message });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const user_id = req.params.id;
    const user = await RegisterModel.findById(user_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post("/api/favorites/sync", async (req, res) => {
     console.log(req.body, "name")

  try {
    const { userId, favoriteLeagues, favoriteTeams, favoritePlayers } = req.body;

    if (!userId || !favoriteLeagues) {
      return res.status(400).json({ message: "id_ and league_id are required." });
    }

     // Update the user's favorite leagues
    const updateResult = await register_model.updateOne(
      { _id: userId},
      { $set: { favorite_league: favoriteLeagues, favorite_player : favoritePlayers, favorite_team : favoriteTeams } }
    );

    console.log("Favorite League added successfully:", updateResult);

    // Fetch the updated favorite leagues from the DB
    const updatedUser = await register_model.findById(userId, "favorite_league");

    res.status(200).json({
      success: true,
      message: "Favorite League added successfully",
      favoriteLeagues: updatedUser.favorite_league || [],
    });
  } catch (err) {
    console.error("Error adding favorite League:", err);
    res.status(500).json({
      message: "Error adding favorite League",
      error: err.message,
    });
  }
});


router.post('/api/followed-teams/sync', (req, res) => {
  userData.followedTeams = req.body.followedTeams || [];
  res.json({ success: true, followedTeams: userData.followedTeams });
});

router.post('/api/followed-players/sync', (req, res) => {
  userData.followedPlayers = req.body.followedPlayers || [];
  res.json({ success: true, followedPlayers: userData.followedPlayers });
});

// For testing: get all user data
router.get('/api/userdata', (req, res) => {
  res.json(userData);
});

router.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const { email, password, phone_string } = req.body;

    const user = new RegisterModel({ email, password, phone_string });
    await user.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Registration failed.", error: e.message });
  }
});

var register_model = RegisterModel



router.get("/users", (req, res)=>{
  async function reloader(){
      const month = await register_model.find()
      res.json(month)
  }

  reloader()
})

router.post("/update_token", async (req, res) => {
    const { id_, token } = req.body;

    if (!id_ || !token) {
        return res.status(400).json({ message: "User ID and token are required." });
    }

    try {
        const updatedUser = await register_model.findByIdAndUpdate(
            id_,
            { phone_string: token },
            { new: true, runValidators: true } // Options: return the updated document and run validators
        );

        if (!updatedUser) {
            console.log({ message: "User not found." });
        }

        console.log({ message: "Phone token updated successfully." });
    } catch (error) {
        console.error('Error updating token:', error);
        res.status(500).json({ message: "Internal server error." });
    }
});















/////////////////////////////////////////////////FOR LEAGUE ADDING

router.post('/favorite_league', async (req, res) => {
  try {
    // Log the request body for debugging
    

    // Ensure req.body.pinned is a valid JSON string and parse it


    console.log(req.body.id_)
    // Update the user's favorite leagues
    const updateResult = await register_model.updateOne(
      { _id: req.body.id_ },
      { $push: { favorite_league: req.body.league_id } } // Assuming pinnedData contains the league data
    );

    // Log a success message
    console.log('Favorite League added successfully', updateResult);

    // Send a success response to the client
    res.status(200).json({ message: 'Favorite League added successfully' });

  } catch (err) {
    // Log the error and send an error response to the client
    console.error('Error adding favorite League:', err);
    res.status(500).json({ message: 'Error adding favorite Player', error: err.message });
  }
});


router.post("/favorite_league_remove", async (req, res) => {
  try {
    // Log the request body for debugging
    console.log('Request Body:', req.body);

       
 

    // Validate that necessary fields are present
    if (!req.body.id_) {
      return res.status(400).json({ message: 'Missing required field: userId' });
    }
 const updateResult = await register_model.updateOne(
      { _id: req.body.  id_ },
      { $pull: { favorite_league: req.body.league_id } }
    );


    // Check if any document was modified
    if (updateResult.modifiedCount === 0) {
      console.log({ message: 'User not found or no changes made' });
    }

    // Log a success message
    console.log('Favorite   League removed successfully', updateResult);

    // Send a success response to the client
    res.status(200).json({ message: 'Favorite League removed successfully' });

  } catch (err) {
    // Log the error and send an error response to the client
    console.error('Error removing favorite League:', err);
    res.status(500).json({ message: 'Error removing favorite Player', error: err.message });
  }
});






////////////////////////////////////////////////////FOR TEAM ADDING

router.post('/favorite_team', async (req, res) => {
  try {
    // Log the request body for debugging
    console.log(req.body);

    // Ensure req.body.pinned is a valid JSON string and parse it
    
    // Update the user's favorite leagues
     const updateResult = await register_model.updateOne(
      { _id: req.body.id_ },
      { $push: { favorite_team: req.body.league_id } } // Assuming pinnedData contains the league data
    );
    // Log a success message
    console.log('Favorite Team added successfully', updateResult);

    // Send a success response to the client
    res.status(200).json({ message: 'Favorite Team added successfully' });

  } catch (err) {
    // Log the error and send an error response to the client
    console.error('Error adding favorite League:', err);
    res.status(500).json({ message: 'Error adding favorite Team', error: err.message });
  }
});


router.post("/favorite_team_remove", async (req, res) => {
  try {
    // Log the request body for debugging
    console.log('Request Body:', req.body);

       
 

    // Validate that necessary fields are present
    if (!req.body.id_) {
      return res.status(400).json({ message: 'Missing required field: userId' });
    }

    // Update the user's favorite leagues by pulling (removing) the object where league_id matches userId
     const updateResult = await register_model.updateOne(
      { _id: req.body.  id_ },
      { $pull: { favorite_team: req.body.league_id } }
    );


    // Check if any document was modified
    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({ message: 'User not found or no changes made' });
    }

    // Log a success message
    console.log('Favorite Team removed successfully', updateResult);

    // Send a success response to the client
    res.status(200).json({ message: 'Favorite Team removed successfully' });

  } catch (err) {
    // Log the error and send an error response to the client
    console.error('Error removing favorite Team:', err);
    res.status(500).json({ message: 'Error removing favorite Team', error: err.message });
  }
});





////////////////////////////////////////////////////FOR PLAYER ADDING

router.post('/favorite_player', async (req, res) => {
  try {
    // Log the request body for debugging
    console.log(req.body.id_);

    // Ensure req.body.pinned is a valid JSON string and parse it



    // Update the user's favorite leagues
    const updateResult = await register_model.updateOne(
      { _id: req.body.id_ },
      { $push: { favorite_player: req.body.player_id } } // Assuming pinnedData contains the league data
    );

    // Log a success message
    console.log('Favorite Player added successfully', updateResult);

    // Send a success response to the client
    res.status(200).json({ message: 'Favorite Player added successfully' });

  } catch (err) {
    // Log the error and send an error response to the client
    console.error('Error adding favorite League:', err);
    res.status(500).json({ message: 'Error adding favorite Player', error: err.message });
  }
});


router.post("/favorite_player_remove", async (req, res) => {
  try {
    // Log the request body for debugging
    console.log('Request Body:', req.body);

       
 

    // Validate that necessary fields are present
    if (!req.body.id_) {
      return res.status(400).json({ message: 'Missing required field: userId' });
    }
 const updateResult = await register_model.updateOne(
      { _id: req.body.  id_ },
      { $pull: { favorite_player: req.body.player_id } }
    );


    // Check if any document was modified
    if (updateResult.modifiedCount === 0) {
      console.log({ message: 'User not found or no changes made' });
    }

    // Log a success message
    console.log('Favorite   Player removed successfully', updateResult);

    // Send a success response to the client
    res.status(200).json({ message: 'Favorite Player removed successfully' });

  } catch (err) {
    // Log the error and send an error response to the client
    console.error('Error removing favorite Player:', err);
    res.status(500).json({ message: 'Error removing favorite Player', error: err.message });
  }
});

router.post("/pinned_matches",async(req, res)=>{
            try {
    // Log the request body for debugging
    console.log(req.body);

    // Ensure req.body.pinned is a valid JSON string and parse it
    const pinnedData = req.body.player_id
    console.log(pinnedData);

    // Update the user's favorite leagues
    const updateResult = await register_model.updateOne(
      { _id: req.body.id_ },
      { $push: { pinned_matches: req.body.player_id } } // Assuming pinnedData contains the league data
    );

    // Log a success message
    console.log('Favorite match added successfully', updateResult);

    // Send a success response to the client
    res.status(200).json({ message: 'Favorite match added successfully' });

  } catch (err) {
    // Log the error and send an error response to the client
    console.error('Error adding favorite match:', err);
    res.status(500).json({ message: 'Error adding favorite match', error: err.message });
  }
})

router.post("/unpinned_matches", async (req, res) => {
  try {
    // Log the request body for debugging
    console.log('Request Body:', req.body);

       
 

    // Validate that necessary fields are present
    if (!req.body.id_) {
      return res.status(400).json({ message: 'Missing required field: userId' });
    }
 const updateResult = await register_model.updateOne(
      { _id: req.body.  id_ },
      { $pull: { pinned_matches: req.body.player_id } }
    );


    // Check if any document was modified
    if (updateResult.modifiedCount === 0) {
      console.log({ message: 'User not found or no changes made' });
    }

    // Log a success message
    console.log('Favorite   Player removed successfully', updateResult);

    // Send a success response to the client
    res.status(200).json({ message: 'Favorite Player removed successfully' });

  } catch (err) {
    // Log the error and send an error response to the client
    console.error('Error removing favorite Player:', err);
    res.status(500).json({ message: 'Error removing favorite Player', error: err.message });
  }
});



module.exports = {router, register_model, model_schema, generateXmasToken, generateMatchesToken, generateMatchDetailsToken}