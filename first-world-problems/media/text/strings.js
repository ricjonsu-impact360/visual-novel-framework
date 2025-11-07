var _STRINGS = {
	"Color" : {
		"text" : '#CCE754',
		"shadow" : '#C7962C',
		"shadowchoose" : '#5D5B5C',
	},

	"Button" : {
		"more" : "more",
		"games" : "games",
    "play" : "Play",
    "shop" : "Shop",
    "ok" : "OK"
	},

	"Ad":{
		"Mobile":{
			"Preroll":{
				"ReadyIn":"The game is ready in ",
				"Loading":"Your game is loading...",
				"Close":"Close",
			},
			"Header":{
				"ReadyIn":"The game is ready in ",
				"Loading":"Your game is loading...",
				"Close":"Close",
			},
			"End":{
				"ReadyIn":"Advertisement ends in ",
				"Loading":"Please wait ...",
				"Close":"Close",
			},								
		},
	},
	
	"Splash":{
		"Loading":"",	//Loading ...
		"LogoLine1":"Some text here",
		"LogoLine2":"powered by MarketJS",
		"LogoLine3":"none",		
        "TapToStart":"TAP TO START",				
	},

	"Game":{
		"SelectPlayer":"Select Player",
		"Win":"You win!",
		"Lose":"You Lose!",
		"Score":"Score",
    "noads":"No ads available",
    "buymore":"Buy more at shop",
    "notenough":"Not enough",
    "reward" : "Congrats!<br>You got",
    "entername" : "Enter your name"
	},

	"Lose":{
		"lose":"GAME OVER",
		"best":"best",
		"score":"score",
	},

	"Leaderboards":{
		"title":"High Score",
		"subTitle": [ "", "1st", "2nd", "3rd" ],
	}, 

	"Results":{
		"Title":"High score",
	},

  "Shop" : {
      "title" : "Shop",
      "subTitle" : [ "", "Hearts", "Gems" ],
      "reward" : [ 0, 100, 50 ],
      "price" : [ 0, 600, 100 ],
      "vcType" : [ 0, 2, 3 ],
      "info" : [ "", "Use to gain affection", "Use for dress up" ],
  },

  "Chapter" : {
      "choose" : "Choose a chapter",
      "chapter" : "Chapter",
      "soon" : "Coming soon",
      "title" : ["","Encounter", "Dummy"],
      "outfit" : ["","casual", ""]
  }

// //CHAPTER 2
//   "Chapter2": [
//     {
//      "sceneID": 0,
//      "text": "I prefer to date...",
//      "charTalk": "none",
//      "char": [],
//      "bg": {
//       "name": "home",
//       "pos": "center"
//      },
//      "animEffect": {
//       "type": "love_gender",
//       "char": []
//      },
//      "option": [
//       {
//        "sceneID": 0
//       },
//       {
//        "sceneID": 1
//       },
//       {
//        "sceneID": 2
//       }
//      ]
//     },
//     {
//      "sceneID": 1,
//      "text": "Men",
//      "charTalk": "none",
//      "char": [],
//      "bg": {
//       "name": "home"
//      },
//      "linkSceneID": 3
//     },
//     {
//      "sceneID": 2,
//      "text": "Women",
//      "charTalk": "none",
//      "char": [],
//      "bg": {
//       "name": "home"
//      },
//      "linkSceneID": 3
//     },
//     {
//      "sceneID": 3,
//      "text": "",
//      "charTalk": "none",
//      "char": [
//       {
//        "name": "Amy",
//        "anim": "ANIM_IDLE",
//        "emotion": "EMO_NEUTRAL",
//        "position": "center"
//       }
//      ],
//      "bg": {
//       "name": "wardrobe",
//       "pos": "center"
//      },
//      "animEffect": {
//       "type": "trans1",
//       "char": [],
//       "color": "#FFFFFF"
//      }
//     },
//     {
//      "sceneID": 4,
//      "text": "This is where the story begin",
//      "charTalk": "none",
//      "char": [
//       {
//        "name": "Amy",
//        "anim": "ANIM_HIP",
//        "emotion": "EMO_NEUTRAL",
//        "position": "center"
//       }
//      ],
//      "bg": {
//       "name": "wardrobe"
//      }
//     },
//     {
//      "sceneID": 5,
//      "text": "Hi, I'm {NAME}",
//      "charTalk": "Amy",
//      "char": [
//       {
//        "name": "Amy",
//        "anim": "ANIM_HIP",
//        "emotion": "EMO_NEUTRAL",
//        "position": "center"
//       }
//      ],
//      "bg": {
//       "name": "wardrobe"
//      }
//     },
//     {
//      "sceneID": 6,
//      "text": "You look gorgeus Amy. ",
//      "charTalk": "Jack",
//      "char": [
//       {
//        "name": "Amy",
//        "anim": "ANIM_KISS",
//        "emotion": "EMO_HAPPY",
//        "position": "right"
//       },
//       {
//        "name": "Jack",
//        "anim": "ANIM_KISS_REAR",
//        "emotion": "EMO_NEUTRAL",
//        "position": "right"
//       }
//      ],
//      "bg": {
//       "name": "cafe"
//      },
//      "animEffect": {
//       "type": "end",
//       "char": []
//      }
//     }
//   ],
// //END CHAPTER 2


// //CHAPTER 1
//  "Chapter1": [
//   {
//    "sceneID": 0,
//    "text": "I prefer to date...",
//    "charTalk": "none",
//    "char": [],
//    "bg": {
//     "name": "home",
//     "pos": "center"
//    },
//    "animEffect": {
//     "type": "love_gender",
//     "char": []
//    },
//    "option": [
//     {
//      "sceneID": 0
//     },
//     {
//      "sceneID": 1
//     },
//     {
//      "sceneID": 2
//     }
//    ]
//   },
//   {
//    "sceneID": 1,
//    "text": "Men",
//    "charTalk": "none",
//    "char": [],
//    "bg": {
//     "name": "home"
//    },
//    "linkSceneID": 3
//   },
//   {
//    "sceneID": 2,
//    "text": "Women",
//    "charTalk": "none",
//    "char": [],
//    "bg": {
//     "name": "home"
//    },
//    "linkSceneID": 3
//   },
//   {
//    "sceneID": 3,
//    "text": "",
//    "charTalk": "none",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "wardrobe",
//     "pos": "center"
//    },
//    "animEffect": {
//     "type": "trans1",
//     "char": [],
//     "color": "#FFFFFF"
//    }
//   },
//   {
//    "sceneID": 4,
//    "text": "This is where the story begin",
//    "charTalk": "none",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_HIP",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "wardrobe"
//    }
//   },
//   {
//    "sceneID": 5,
//    "text": "Hi, I'm {NAME}",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_HIP",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "wardrobe"
//    },
//    "animEffect": {
//     "type": "input_name",
//     "char": []
//    }
//   },
//   {
//    "sceneID": 6,
//    "text": "I should change my clothes.",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "wardrobe"
//    }
//   },
//   {
//    "sceneID": 7,
//    "text": "",
//    "charTalk": "none",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_HIP",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "wardrobe"
//    },
//    "animEffect": {
//     "type": "dress_up",
//     "char": []
//    },
//    "option": [
//     {
//      "sceneID": 0
//     },
//     {
//      "sceneID": "Casual",
//      "reward": {
//       "virtualCurrency1": 100
//      }
//     },
//     {
//      "sceneID": "Sexy",
//      "cost": {
//       "virtualCurrency3": 4
//      },
//      "reward": {
//       "virtualCurrency2": 3
//      }
//     }
//    ]
//   },
//   {
//    "sceneID": 8,
//    "text": "Good choice!",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "wardrobe"
//    }
//   },
//   {
//    "sceneID": 9,
//    "text": "Now I should go to work.",
//    "charTalk": "none",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_HIP",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "wardrobe"
//    }
//   },
//   {
//    "sceneID": 10,
//    "text": "",
//    "charTalk": "none",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "wardrobe"
//    },
//    "animEffect": {
//     "type": "walk_out",
//     "char": [
//      {
//       "name": "Amy"
//      }
//     ]
//    }
//   },
//   {
//    "sceneID": 11,
//    "text": "",
//    "charTalk": "none",
//    "char": [],
//    "bg": {
//     "name": "wardrobe"
//    },
//    "animEffect": {
//     "type": "trans1",
//     "char": []
//    }
//   },
//   {
//    "sceneID": 12,
//    "text": "",
//    "charTalk": "none",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_CROSS",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "cafe",
//     "pos": "left"
//    },
//    "animEffect": {
//     "type": "pan",
//     "char": [],
//     "panEnd": "center"
//    }
//   },
//   {
//    "sceneID": 13,
//    "text": "Hey {NAME}! I can't believe to meet | \"color\":\"#FF3333\", \"format\":\"bold italic\" | you | RESET | here!",
//    "charTalk": "Jack",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_CROSS",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     }
//    ],
//    "bg": {
//     "name": "cafe"
//    },
//    "animEffect": {
//     "type": "walk_in",
//     "char": [
//      {
//       "name": "Jack"
//      }
//     ]
//    }
//   },
//   {
//    "sceneID": 14,
//    "text": "{Jack}, childhood friend",
//    "charTalk": "none",
//    "char": [],
//    "animEffect": {
//     "type": "freeze_frame",
//     "char": [
//      {
//       "name": "Jack",
//       "anim": "ANIM_LAUGH",
//       "emotion": "EMO_NEUTRAL",
//       "bg": "home"
//      }
//     ],
//     "frame_type": "2"
//    }
//   },
//   {
//    "sceneID": 15,
//    "text": "Hey {Jack} do you remember when we were in highschool?",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_HIP",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     }
//    ],
//    "bg": {
//     "name": "cafe"
//    },
//    "reward": {
//     "virtualCurrency2": 3
//    }
//   },
//   {
//    "sceneID": 16,
//    "text": "",
//    "charTalk": "none",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_ANGRY",
//      "position": "right"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "office",
//     "pos": "center"
//    },
//    "animEffect": {
//     "type": "flashback",
//     "char": [],
//     "color": "#ffc63c"
//    }
//   },
//   {
//    "sceneID": 17,
//    "text": "This exam is really frustating!",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_ANGRY",
//      "emotion": "EMO_ANGRY",
//      "position": "right"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    }
//   },
//   {
//    "sceneID": 18,
//    "text": "What happen with our princess?",
//    "charTalk": "Jack",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_ANGRY",
//      "position": "right"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_LAUGH",
//      "emotion": "EMO_HAPPY",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    }
//   },
//   {
//    "sceneID": 19,
//    "text": "Oh shut up {Jack}! I dare you to show your math score!",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_CROSS",
//      "emotion": "EMO_ANGRY",
//      "position": "right"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_LAUGH",
//      "emotion": "EMO_HAPPY",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    },
//    "sfx": {
//     "name": "chipmunk_laugh",
//     "loop": true
//    }
//   },
//   {
//    "sceneID": 20,
//    "text": "Wow please spare me {NAME}.",
//    "charTalk": "Jack",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_CROSS",
//      "emotion": "EMO_ANGRY",
//      "position": "right"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_AWKWARD",
//      "emotion": "EMO_SAD",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    },
//    "sfx": {
//     "name": "record_scratch",
//     "stop": true
//    }
//   },
//   {
//    "sceneID": 21,
//    "text": "Of cource I remember.",
//    "charTalk": "Jack",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_HIP",
//      "emotion": "EMO_HAPPY",
//      "position": "left"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_LAUGH",
//      "emotion": "EMO_HAPPY",
//      "position": "right"
//     }
//    ],
//    "bg": {
//     "name": "cafe",
//     "pos": "center"
//    },
//    "animEffect": {
//     "type": "flashback_end",
//     "char": []
//    }
//   },
//   {
//    "sceneID": 22,
//    "text": "Well let's talk again another time",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_MOUTH",
//      "emotion": "EMO_HAPPY",
//      "position": "left"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     }
//    ],
//    "bg": {
//     "name": "cafe"
//    }
//   },
//   {
//    "sceneID": 23,
//    "text": "",
//    "charTalk": "none",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     }
//    ],
//    "bg": {
//     "name": "cafe"
//    },
//    "animEffect": {
//     "type": "walk_out",
//     "char": [
//      {
//       "name": "Amy",
//       "speed": 3
//      },
//      {
//       "name": "Jack",
//       "speed": 1
//      }
//     ]
//    }
//   },
//   {
//    "sceneID": 24,
//    "text": "",
//    "charTalk": "none",
//    "char": [],
//    "bg": {
//     "name": "office"
//    },
//    "animEffect": {
//     "type": "trans1",
//     "char": []
//    }
//   },
//   {
//    "sceneID": 25,
//    "text": "{NAME} had just returned to her office when she was called by Max, her boss.",
//    "charTalk": "none",
//    "char": [
//     {
//      "name": "Amy",
//      "faceTo": "left",
//      "anim": "ANIM_HIP",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    },
//    "animEffect": {
//     "type": "walk_in",
//     "char": [
//      {
//       "name": "Amy",
//       "from": "right"
//      }
//     ]
//    }
//   },
//   {
//    "sceneID": 26,
//    "text": "Hey {NAME}, meet {Carl}. {He} was assigned to help you with C campaign.",
//    "charTalk": "Max",
//    "char": [
//     {
//      "name": "Amy",
//      "faceTo": "right",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     },
//     {
//      "name": "Max",
//      "anim": "ANIM_HIP",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     },
//     {
//      "name": "Carl",
//      "faceTo": "left",
//      "anim": "ANIM_IDLE_REAR",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office",
//     "pos": "center"
//    },
//    "animEffect": {
//     "type": "walk_in",
//     "char": [
//      {
//       "name": "Max",
//       "from": "right"
//      },
//      {
//       "name": "Carl",
//       "speed": 1,
//       "from": "right",
//       "rear": true
//      }
//     ]
//    }
//   },
//   {
//    "sceneID": 27,
//    "text": "{Carl}, new employee",
//    "charTalk": "none",
//    "char": [],
//    "animEffect": {
//     "type": "freeze_frame",
//     "char": [
//      {
//       "name": "Carl",
//       "faceTo": "left",
//       "anim": "ANIM_AWKWARD",
//       "emotion": "EMO_NEUTRAL",
//       "bg": "home"
//      }
//     ],
//     "frame_type": "3"
//    }
//   },
//   {
//    "sceneID": 28,
//    "text": "I never met {him} before. Is {he} a new employee?",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "faceTo": "right",
//      "anim": "ANIM_CROSS",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     },
//     {
//      "name": "Max",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     },
//     {
//      "name": "Carl",
//      "faceTo": "left",
//      "anim": "ANIM_IDLE_REAR",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    }
//   },
//   {
//    "sceneID": 29,
//    "text": "Not really. {He} was working on different department and just moved to ours now.",
//    "charTalk": "Max",
//    "char": [
//     {
//      "name": "Amy",
//      "faceTo": "right",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     },
//     {
//      "name": "Max",
//      "anim": "ANIM_CROSS",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     },
//     {
//      "name": "Carl",
//      "faceTo": "left",
//      "anim": "ANIM_IDLE_REAR",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    }
//   },
//   {
//    "sceneID": 30,
//    "text": "Hi, I'm {Carl}. I look forward working with you {NAME}.",
//    "charTalk": "Carl",
//    "char": [
//     {
//      "name": "Amy",
//      "faceTo": "right",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     },
//     {
//      "name": "Max",
//      "anim": "ANIM_CROSS",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     },
//     {
//      "name": "Carl",
//      "faceTo": "left",
//      "anim": "ANIM_TALK_REAR",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    }
//   },
//   {
//    "sceneID": 31,
//    "text": "Well I'll leave {him} to you {NAME}. Make sure you brief {him} with the campaign progress.",
//    "charTalk": "Max",
//    "char": [
//     {
//      "name": "Amy",
//      "faceTo": "right",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     },
//     {
//      "name": "Max",
//      "anim": "ANIM_HIP",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     },
//     {
//      "name": "Carl",
//      "faceTo": "left",
//      "anim": "ANIM_IDLE_REAR",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    }
//   },
//   {
//    "sceneID": 32,
//    "text": "",
//    "charTalk": "none",
//    "char": [
//     {
//      "name": "Amy",
//      "faceTo": "right",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     },
//     {
//      "name": "Max",
//      "anim": "ANIM_HIP",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     },
//     {
//      "name": "Carl",
//      "faceTo": "left",
//      "anim": "ANIM_IDLE_REAR",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    },
//    "animEffect": {
//     "type": "walk_out",
//     "char": [
//      {
//       "name": "Max",
//       "from": "right"
//      }
//     ]
//    }
//   },
//   {
//    "sceneID": 33,
//    "text": "",
//    "charTalk": "none",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_MOUTH",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     },
//     {
//      "name": "Carl",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office",
//     "pos": "center"
//    },
//    "animEffect": {
//     "type": "trans1",
//     "char": []
//    }
//   },
//   {
//    "sceneID": 34,
//    "text": "Hi, I'm {NAME}, the marketing manager. We'll be working together now.",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_MOUTH",
//      "emotion": "EMO_HAPPY",
//      "position": "left"
//     },
//     {
//      "name": "Carl",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    }
//   },
//   {
//    "sceneID": 35,
//    "text": "It's great to have you on board, {Carl}. I thought we could get to know each other a bit.",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     },
//     {
//      "name": "Carl",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    }
//   },
//   {
//    "sceneID": 36,
//    "text": "Tell me, what brought you to this company?",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_CROSS",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     },
//     {
//      "name": "Carl",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    }
//   },
//   {
//    "sceneID": 37,
//    "text": "{Carl} Harrison. I'm here because this company aligns with my career goals.",
//    "charTalk": "Carl",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     },
//     {
//      "name": "Carl",
//      "anim": "ANIM_CROSS",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    }
//   },
//   {
//    "sceneID": 38,
//    "text": "Maybe I should ask personal question to break the ice.",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_HIP",
//      "emotion": "EMO_HAPPY",
//      "position": "left"
//     },
//     {
//      "name": "Carl",
//      "anim": "ANIM_CROSS",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    },
//    "animEffect": {
//     "type": "zoom_in",
//     "char": [
//      "Amy"
//     ]
//    },
//    "option": [
//     {
//      "sceneID": 0
//     },
//     {
//      "sceneID": 39
//     },
//     {
//      "sceneID": 41,
//      "cost": {
//       "virtualCurrency1": 400
//      }
//     },
//     {
//      "sceneID": 43,
//      "cost": {
//       "rv": true
//      }
//     }
//    ]
//   },
//   {
//    "sceneID": 39,
//    "text": "So, tell me, what do you enjoy doing outside of work? Any hobbies or interests?",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_HIP",
//      "emotion": "EMO_HAPPY",
//      "position": "left"
//     },
//     {
//      "name": "Carl",
//      "anim": "ANIM_CROSS",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    },
//    "animEffect": {
//     "type": "zoom_out",
//     "char": []
//    }
//   },
//   {
//    "sceneID": 40,
//    "text": "I prefer to keep my personal life separate from work, Amy.",
//    "charTalk": "Carl",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     },
//     {
//      "name": "Carl",
//      "anim": "ANIM_CROSS",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    },
//    "linkSceneID": 49
//   },
//   {
//    "sceneID": 41,
//    "text": "Where did you grow up?",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_HIP",
//      "emotion": "EMO_HAPPY",
//      "position": "left"
//     },
//     {
//      "name": "Carl",
//      "anim": "ANIM_CROSS",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    },
//    "animEffect": {
//     "type": "zoom_out",
//     "char": []
//    }
//   },
//   {
//    "sceneID": 42,
//    "text": "I grew up in a city not too far from here.",
//    "charTalk": "Carl",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     },
//     {
//      "name": "Carl",
//      "anim": "ANIM_CROSS",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    },
//    "linkSceneID": 49
//   },
//   {
//    "sceneID": 43,
//    "text": "What do you think about office dating?",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_HIP",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     },
//     {
//      "name": "Carl",
//      "anim": "ANIM_CROSS",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    },
//    "animEffect": {
//     "type": "zoom_out",
//     "char": []
//    }
//   },
//   {
//    "sceneID": 44,
//    "text": "You should be more tactful.",
//    "charTalk": "Carl",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     },
//     {
//      "name": "Carl",
//      "anim": "ANIM_TALKSHEEPHISH",
//      "emotion": "EMO_BLUSH",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    },
//    "sfx": {
//     "name": "record_scratch"
//    }
//   },
//   {
//    "sceneID": 45,
//    "text": "Do you believe in love at first sight, or are you more of a skeptic?",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_HIP",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     },
//     {
//      "name": "Carl",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_BLUSH",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    }
//   },
//   {
//    "sceneID": 46,
//    "text": "Love at first sight? That's... well, I've never really thought about it.",
//    "charTalk": "Carl",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     },
//     {
//      "name": "Carl",
//      "anim": "ANIM_HIP",
//      "emotion": "EMO_BLUSH",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    }
//   },
//   {
//    "sceneID": 47,
//    "text": "Come on, everyone has some opinion on it. Indulge me, {Carl}. Do you think it's possible?",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_GIGGLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     },
//     {
//      "name": "Carl",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_BLUSH",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    }
//   },
//   {
//    "sceneID": 48,
//    "text": "I... I suppose it's possible for some people, under certain circumstances.",
//    "charTalk": "Carl",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     },
//     {
//      "name": "Carl",
//      "anim": "ANIM_CROSS",
//      "emotion": "EMO_BLUSH",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    }
//   },
//   {
//    "sceneID": 49,
//    "text": "We should discuss our work.",
//    "charTalk": "Carl",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     },
//     {
//      "name": "Carl",
//      "anim": "ANIM_CROSS",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    }
//   },
//   {
//    "sceneID": 50,
//    "text": "Fine. Let's start working and leave early.",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_HIP",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     },
//     {
//      "name": "Carl",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    }
//   },
//   {
//    "sceneID": 51,
//    "text": "",
//    "charTalk": "none",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     },
//     {
//      "name": "Carl",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    },
//    "animEffect": {
//     "type": "walk_out",
//     "char": [
//      {
//       "name": "Amy"
//      }
//     ]
//    }
//   },
//   {
//    "sceneID": 52,
//    "text": "Whew. I think it will be hard working with her.",
//    "charTalk": "Carl",
//    "char": [
//     {
//      "name": "Carl",
//      "anim": "ANIM_HIP",
//      "emotion": "EMO_BLUSH",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    },
//    "sfx": {
//     "name": "trumpet_fail"
//    }
//   },
//   {
//    "sceneID": 53,
//    "text": "",
//    "charTalk": "none",
//    "char": [
//     {
//      "name": "Carl",
//      "anim": "ANIM_HIP",
//      "emotion": "EMO_BLUSH",
//      "position": "center"
//     }
//    ],
//    "bg": {
//     "name": "office"
//    },
//    "animEffect": {
//     "type": "trans1",
//     "char": []
//    }
//   },
//   {
//    "sceneID": 54,
//    "text": "",
//    "charTalk": "none",
//    "char": [],
//    "bg": {
//     "name": "home"
//    },
//    "animEffect": {
//     "type": "text_chat",
//     "char": [],
//     "name": "CHAPTER1_ID1"
//    }
//   },
//   {
//    "sceneID": 55,
//    "text": "",
//    "charTalk": "none",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_LAUGH",
//      "emotion": "EMO_HAPPY",
//      "position": "right"
//     }
//    ],
//    "bg": {
//     "name": "cafe"
//    },
//    "animEffect": {
//     "type": "trans1",
//     "char": []
//    }
//   },
//   {
//    "sceneID": 56,
//    "text": "Hey there's new member in my team. He's really {handsome}.",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_GIGGLE",
//      "emotion": "EMO_HAPPY",
//      "position": "right"
//     },
//     {
//      "name": "Isabella",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "cafe"
//    }
//   },
//   {
//    "sceneID": 57,
//    "text": "Then did you flirt with {him} on first meet?",
//    "charTalk": "Isabella",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_GIGGLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     },
//     {
//      "name": "Isabella",
//      "anim": "ANIM_BLINKING",
//      "emotion": "EMO_HAPPY",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "cafe"
//    }
//   },
//   {
//    "sceneID": 58,
//    "text": "I won't say it's a flirt. I just ask some personal question to get closer.",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_MOUTH",
//      "emotion": "EMO_HAPPY",
//      "position": "right"
//     },
//     {
//      "name": "Isabella",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "cafe"
//    }
//   },
//   {
//    "sceneID": 59,
//    "text": "That's called flirting!",
//    "charTalk": "Isabella",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_MOUTH",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     },
//     {
//      "name": "Isabella",
//      "anim": "ANIM_LAUGH",
//      "emotion": "EMO_HAPPY",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "cafe"
//    }
//   },
//   {
//    "sceneID": 60,
//    "text": "Oh come on! If we talk about flirting, we should head to the club. I bet we can find some {handsome} {men}.",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_HIP",
//      "emotion": "EMO_HAPPY",
//      "position": "right"
//     },
//     {
//      "name": "Isabella",
//      "anim": "ANIM_LAUGH",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "cafe"
//    }
//   },
//   {
//    "sceneID": 61,
//    "text": "Wohooo",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_DANCEUP",
//      "emotion": "EMO_HAPPY",
//      "position": "right"
//     },
//     {
//      "name": "Isabella",
//      "anim": "ANIM_DANCEHIP",
//      "emotion": "EMO_HAPPY",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "club",
//     "pos": "center"
//    },
//    "animEffect": {
//     "type": "trans1",
//     "char": []
//    }
//   },
//   {
//    "sceneID": 62,
//    "text": "Yeaaay",
//    "charTalk": "Isabella",
//    "char": [
//     {
//      "name": "Amy",
//      "faceTo": "left",
//      "anim": "ANIM_GROOVE",
//      "emotion": "EMO_HAPPY",
//      "position": "right"
//     },
//     {
//      "name": "Isabella",
//      "faceTo": "right",
//      "anim": "ANIM_DANCEUP",
//      "emotion": "EMO_HAPPY",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "club"
//    }
//   },
//   {
//    "sceneID": 63,
//    "text": "Let's get wasted tonight!",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "faceTo": "right",
//      "anim": "ANIM_DANCEHIP",
//      "emotion": "EMO_HAPPY",
//      "position": "right"
//     },
//     {
//      "name": "Isabella",
//      "faceTo": "left",
//      "anim": "ANIM_GROOVE",
//      "emotion": "EMO_HAPPY",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "club"
//    }
//   },
//   {
//    "sceneID": 64,
//    "text": "You're right! We won't go home until morning!",
//    "charTalk": "Isabella",
//    "char": [
//     {
//      "name": "Amy",
//      "faceTo": "right",
//      "anim": "ANIM_DANCEHIP",
//      "emotion": "EMO_HAPPY",
//      "position": "right"
//     },
//     {
//      "name": "Isabella",
//      "faceTo": "left",
//      "anim": "ANIM_DANCEUP",
//      "emotion": "EMO_HAPPY",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "club"
//    }
//   },
//   {
//    "sceneID": 65,
//    "text": "I'm beat. I'll go and chill for a bit.",
//    "charTalk": "Isabella",
//    "char": [
//     {
//      "name": "Amy",
//      "faceTo": "right",
//      "anim": "ANIM_DANCEUP",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     },
//     {
//      "name": "Isabella",
//      "faceTo": "left",
//      "anim": "ANIM_DANCEHIP",
//      "emotion": "EMO_HAPPY",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "club"
//    }
//   },
//   {
//    "sceneID": 66,
//    "text": "",
//    "charTalk": "none",
//    "char": [
//     {
//      "name": "Amy",
//      "faceTo": "right",
//      "anim": "ANIM_GROOVE",
//      "emotion": "EMO_HAPPY",
//      "position": "right"
//     },
//     {
//      "name": "Isabella",
//      "faceTo": "left",
//      "anim": "ANIM_GROOVE",
//      "emotion": "EMO_HAPPY",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "club"
//    },
//    "animEffect": {
//     "type": "walk_out",
//     "char": [
//      {
//       "name": "Isabella"
//      }
//     ]
//    }
//   },
//   {
//    "sceneID": 67,
//    "text": "Hi {NAME}!",
//    "charTalk": "Jack",
//    "char": [
//     {
//      "name": "Amy",
//      "faceTo": "right",
//      "anim": "ANIM_LAUGH",
//      "emotion": "EMO_HAPPY",
//      "position": "right"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_CHEER",
//      "emotion": "EMO_HAPPY",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "club"
//    },
//    "animEffect": {
//     "type": "walk_in",
//     "char": [
//      {
//       "name": "Jack"
//      }
//     ]
//    }
//   },
//   {
//    "sceneID": 68,
//    "text": "I wonder why {Jack} is here.",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "faceTo": "left",
//      "anim": "ANIM_AWKWARD",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_HAPPY",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "club"
//    },
//    "bubbleType": "think"
//   },
//   {
//    "sceneID": 69,
//    "text": "Hi {Jack}! We meet again.",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "faceTo": "left",
//      "anim": "ANIM_LAUGH",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_HAPPY",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "club"
//    }
//   },
//   {
//    "sceneID": 70,
//    "text": "Yes, isn't this fate?",
//    "charTalk": "Jack",
//    "char": [
//     {
//      "name": "Amy",
//      "faceTo": "left",
//      "anim": "ANIM_LAUGH",
//      "emotion": "EMO_HAPPY",
//      "position": "right"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_FLIRT",
//      "emotion": "EMO_HAPPY",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "club"
//    }
//   },
//   {
//    "sceneID": 71,
//    "text": "Well maybe a little bit.",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "faceTo": "left",
//      "anim": "ANIM_BLINKING",
//      "emotion": "EMO_BLUSH",
//      "position": "right"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_FLIRT",
//      "emotion": "EMO_HAPPY",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "club"
//    }
//   },
//   {
//    "sceneID": 72,
//    "text": "Can I have the honor to dance together?",
//    "charTalk": "Jack",
//    "char": [
//     {
//      "name": "Amy",
//      "faceTo": "left",
//      "anim": "ANIM_BLINKING",
//      "emotion": "EMO_BLUSH",
//      "position": "right"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_BOW",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "club"
//    }
//   },
//   {
//    "sceneID": 73,
//    "text": "Of cource. The honor is mine.",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "faceTo": "left",
//      "anim": "ANIM_BOW",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "club"
//    }
//   },
//   {
//    "sceneID": 74,
//    "text": "Why you're here alone?",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "faceTo": "left",
//      "anim": "ANIM_DANCEHIP",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_DANCEUP",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "club"
//    }
//   },
//   {
//    "sceneID": 75,
//    "text": "Well I'm not. I'm here with my sister. Then she ditch me for a man.",
//    "charTalk": "Jack",
//    "char": [
//     {
//      "name": "Amy",
//      "faceTo": "left",
//      "anim": "ANIM_DANCEUP",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_DANCEHIP",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "club"
//    }
//   },
//   {
//    "sceneID": 76,
//    "text": "You mean Ambrosia? Wow it's been a long time since I met her.",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "faceTo": "left",
//      "anim": "ANIM_GROOVE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_DANCEUP",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "club"
//    }
//   },
//   {
//    "sceneID": 77,
//    "text": "Yeah. She missed you too.",
//    "charTalk": "Jack",
//    "char": [
//     {
//      "name": "Amy",
//      "faceTo": "left",
//      "anim": "ANIM_DANCEHIP",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_GROOVE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "club"
//    }
//   },
//   {
//    "sceneID": 78,
//    "text": "",
//    "charTalk": "none",
//    "char": [
//     {
//      "name": "Amy",
//      "faceTo": "left",
//      "anim": "ANIM_DANCEHIP",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_GROOVE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "club"
//    },
//    "animEffect": {
//     "type": "trans1",
//     "char": []
//    }
//   },
//   {
//    "sceneID": 79,
//    "text": "",
//    "charTalk": "none",
//    "char": [],
//    "bg": {
//     "name": "home"
//    },
//    "animEffect": {
//     "type": "text_chat",
//     "char": [],
//     "name": "CHAPTER1_ID2"
//    }
//   },
//   {
//    "sceneID": 80,
//    "text": "",
//    "charTalk": "none",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_HIP",
//      "emotion": "EMO_HAPPY",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "wardrobe",
//     "pos": "center"
//    },
//    "animEffect": {
//     "type": "trans1",
//     "char": []
//    }
//   },
//   {
//    "sceneID": 81,
//    "text": "{Carl} is really an interesting {guy}.",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_HIP",
//      "emotion": "EMO_HAPPY",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "wardrobe"
//    },
//    "bubbleType": "think"
//   },
//   {
//    "sceneID": 82,
//    "text": "Teasing {him} is so much fun.",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_GIGGLE",
//      "emotion": "EMO_HAPPY",
//      "position": "left"
//     }
//    ],
//    "bg": {
//     "name": "wardrobe"
//    },
//    "bubbleType": "think"
//   },
//   {
//    "sceneID": 83,
//    "text": "The next day",
//    "charTalk": "none",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     }
//    ],
//    "bg": {
//     "name": "cafe",
//     "pos": "center"
//    }
//   },
//   {
//    "sceneID": 84,
//    "text": "",
//    "charTalk": "none",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_IDLE",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     }
//    ],
//    "bg": {
//     "name": "cafe"
//    },
//    "animEffect": {
//     "type": "trans1",
//     "char": []
//    }
//   },
//   {
//    "sceneID": 85,
//    "text": "Hey Amy, did you wait long?",
//    "charTalk": "Jack",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_HUG",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_HUG_REAR",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     }
//    ],
//    "bg": {
//     "name": "cafe"
//    },
//    "animEffect": {
//     "type": "walk_in",
//     "char": [
//      {
//       "name": "Jack",
//       "from": "left",
//       "rear": true
//      }
//     ]
//    }
//   },
//   {
//    "sceneID": 86,
//    "text": "No, I just arrived.",
//    "charTalk": "Amy",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_MOUTH",
//      "emotion": "EMO_HAPPY",
//      "position": "right"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_IDLE_REAR",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     }
//    ],
//    "bg": {
//     "name": "cafe"
//    }
//   },
//   {
//    "sceneID": 87,
//    "text": "You look gorgeus Amy. ",
//    "charTalk": "Jack",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_KISS",
//      "emotion": "EMO_HAPPY",
//      "position": "right"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_KISS_REAR",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     }
//    ],
//    "bg": {
//     "name": "cafe"
//    }
//   },
//   {
//    "sceneID": 88,
//    "text": "You look gorgeus Amy. ",
//    "charTalk": "Jack",
//    "char": [
//     {
//      "name": "Amy",
//      "anim": "ANIM_KISS",
//      "emotion": "EMO_HAPPY",
//      "position": "right"
//     },
//     {
//      "name": "Jack",
//      "anim": "ANIM_KISS_REAR",
//      "emotion": "EMO_NEUTRAL",
//      "position": "right"
//     }
//    ],
//    "bg": {
//     "name": "cafe"
//    },
//    "animEffect": {
//     "type": "end",
//     "char": []
//    }
//   }
//  ],
// //END CHAPTER 1
 
 // "phone": [
 //    {
 //      "title": "CHAPTER1_ID1",
 //      "subtitle": "Jack",
 //      "people": [
 //        {
 //          "id": 1,
 //          "name": "Jack",
 //          "path": "media/graphics/sprites/chat/jack.png"
 //        },
 //        {
 //          "id": 2,
 //          "name": "Amy",
 //          "path": "media/graphics/sprites/chat/amy.png"
 //        }
 //      ],
 //      "data": [
 //        {
 //          "id": 0,
 //          "image": "",
 //          "text": "That night"
 //        },
 //        {
 //          "id": 1,
 //          "image": "",
 //          "text": "Hey {NAME}, how about we grab a lunch together tomorrow?"
 //        },
 //        {
 //          "id": 2,
 //          "image": "",
 //          "text": "Sure {Jack}, where we should go for lunch?"
 //        },
 //        {
 //          "id": 1,
 //          "image": "pic1",
 //          "text": "There's new Italian restaurant in Kale road."
 //        },
 //        {
 //          "id": 2,
 //          "image": "",
 //          "text": "Oh I heard about that restaurant. Belle said their pasta is really good."
 //        },
 //        {
 //          "id": 1,
 //          "image": "",
 //          "text": "Then it's decided. I'll pick you up at 12."
 //        },
 //        {
 //          "id": 2,
 //          "image": "",
 //          "text": "Okay. See you tomorrow {Jack}."
 //        },
 //        {
 //          "id": 1,
 //          "image": "",
 //          "text": "See ya."
 //        }
 //      ]
 //    },
 //    {
 //      "title": "CHAPTER1_ID2",
 //      "subtitle": "Carl",
 //      "people": [
 //        {
 //          "id": 1,
 //          "name": "Amy",
 //          "path": "media/graphics/sprites/chat/amy.png"
 //        },
 //        {
 //          "id": 2,
 //          "name": "Carl",
 //          "path": "media/graphics/sprites/chat/carl.png"
 //        }
 //      ],
 //      "data": [
 //        {
 //          "id": 1,
 //          "image": "",
 //          "text": "Hi {Carl}. Did you prepare item Y?"
 //        },
 //        {
 //          "id": 2,
 //          "image": "",
 //          "text": "Yes, I have finished it. I already sent it to your email this evening."
 //        },
 //        {
 //          "id": 1,
 //          "image": "",
 //          "text": "Thank you. Let me check my email."
 //        },
 //        {
 //          "id": 1,
 //          "image": "",
 //          "text": "I have to discuss some items with you. Can we have a meeting tomorrow at 3 PM?"
 //        },
 //        {
 //          "id": 2,
 //          "image": "",
 //          "text": "Sure, I'll be there."
 //        },
 //        {
 //          "id": 1,
 //          "image": "",
 //          "text": "Wow look at how quick you replied. Are you waiting for me to text you? 😉"
 //        },
 //        {
 //          "id": 2,
 //          "image": "",
 //          "text": "No I'm not!"
 //        },
 //        {
 //          "id": 1,
 //          "image": "",
 //          "text": "You don't have to be shy. How about we have dinner after meeting?"
 //        },
 //        {
 //          "id": 1,
 //          "image": "",
 //          "text": "I know a good restaurant nearby the office. We should know each other more to increase our teamwork."
 //        },
 //        {
 //          "id": 2,
 //          "image": "",
 //          "text": "Sorry, I'm not available. I would appreciate it if you can stop teasing me. We should only talk about work."
 //        },
 //        {
 //          "id": 2,
 //          "image": "",
 //          "text": "If there's nothing else then see you at tomorrow meeting."
 //        }
 //      ]
 //    }
 //  ]
};

		// { 
		// 	bg:"cafe", animBG:"NONE",
		// 	char:[ true, true, false],
		// 	animChar:[ '', '', ''],
		// 	posChar:[ 'LEFT', 'RIGHT', 'NONE'],
		// 	tail:"LEFT",
		// 	text: "",
		// },