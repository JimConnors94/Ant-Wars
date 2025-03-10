const characters = [
    {
      name: "Angoliant the Terrible",
      icon: "img/spider.png",
      music: "audio/spiderMusic.wav",
      encounters: [
        {
          // Angoliant Conversation 1
          text: "While out on patrol, a troop of 10 warrior ants encounter a terrifying beast of a spider! They cower in fear, waiting for the monster to rip them apart... But it appears the spider wishes to speak?",
          responses: [
            {
              text: "What do you want with us, spider?",
              next: {
                name: "Angoliant the Terrible",
                icon: "img/spider.png",
                text: "Greetings, small tasty one! No no! Do not run! For an offer Angoliant has...",
                responses: [
                  {
                    text: "What is your offer?",
                    next: {
                      name: "Angoliant the Terrible",
                      icon: "img/spider.png",
                      text: "Your kind is so tasty, but chasing you down is tiresome. Angoliant understands you are at war, Angoliant can provide you with power that would be... indispensable for your war effort... All Angoliant asks for in return, is but for a few of your worthy selves to sacrifice themselves, to the greater good of your colony...",
                      responses: [
                        {
                          text: "By sacrifice, you mean you expect us to let you eat us?!",
                          next: {
                            name: "Angoliant the Terrible",
                            icon: "img/spider.png",
                            text: "Ah, you understand perfectly. Wonderful. Yes, Angoliant will give you the tools to destroy your Enemy, and in return, some of you will sacrifice your delicious flesh to Angoliant. Believe what Angoliant says, for with Angoliant's power, many more of your puny lives will be saved from this war.",
                            responses: [
                              {
                                text: "We Ants would never agree to such a hideous deal! Ants do not fear death, but we will never die without honor!",
                                next: {
                                  name: "Angoliant the Terrible",
                                  icon: "img/spider.png",
                                  text: "Foolish Ants... Die with your honor then! Prepare yourselves...",
                                  responses: [
                                    {
                                      text: "Stand your ground! We fight to the last ant!",
                                      action: spiderAttack,
                                    },
                                  ],
                                },
                              },
                              {
                                text: "You ask for far too much, Angoliant... but compared to the war with the Enemy... even you are the lesser of two evils. The Ants will accept your evil bargain.",
                                next: {
                                  name: "Angoliant the Terrible",
                                  icon: "img/spider.png",
                                  text: "Yessssss... good, good... Angoliant will tell you the location of Angoliant's secret lair. When you are ready, come to Angoliant with your sacrifices! Hahahahaha!",
                                  responses: [
                                    {
                                      text: "We will do what must be done... for the colony.",
                                      action: spiderInCamp,
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                        {
                          text: "I don't like where this is going... Ants! Attack!",
                          next: {
                            name: "Angoliant the Terrible",
                            icon: "img/spider.png",
                            text: "Then so be it. Angoliant has more fun this way anyways!",
                            responses: [
                              {
                                text: "Charge!",
                                action: spiderAttack,
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                  {
                    text: "We don't trust you! And we would rather die fighting!",
                    next: {
                      name: "Angoliant the Terrible",
                      icon: "img/spider.png",
                      text: "Fools. You die pointlessly.",
                      responses: [
                        {
                          text: "Then we die as warriors!",
                          action: spiderAttack,
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              text: "We do not fear you, foul beast! Everyone attack!",
              next: {
                name: "Angoliant the Terrible",
                icon: "img/spider.png",
                text: "Brave but foolish. None can stand against Angoliant.",
                responses: [
                  {
                    text: "To battle!",
                    action: spiderAttack,
                  },
                ],
              },
            },
            {
              text: "S-s-s-SPIDER! RUN!",
              next: {
                name: "Angoliant the Terrible",
                icon: "img/spider.png",
                text: "Cowards! No one escapes from Angoliant!",
                responses: [
                  {
                    text: "Scatter!",
                    action: spiderAttack,
                  },
                ],
              },
            },
          ],
        },
        {
          // Angoliant Conversation 2
          text: "Oh it's you again",
          responses: [
            {
              text: "No, we have come to end you once and for all!",
              action: spiderAttack,
            },
            {
              text: "Very well... Take what you need.",
              action: spiderInCamp,
            },
          ],
        },
      ],
    },
    {
      name: "Heracles the Mighty",
      icon: "img/beetle.png",
      music: "audio/beetleMusic.wav",
      encounters: [
        {
          text: "A large, muscular beetle approaches the ant hill... He says he wishes to speak to the queen...",
          responses: [
            {
              text: "What do you want with our Queen?",
              next: {
                name: "Heracles the Mighty",
                icon: "img/beetle.png",
                text: "Hello friend! Allow me to introduce myself! Professionally I am known as 'The World's Strongest Beetle In The Entire World'! But you can just call me Heracles: 'The Mightiest One'!",
                responses: [
                  {
                    text: "Uh huh...",
                    next: {
                      name: "Heracles the Mighty",
                      icon: "img/beetle.png",
                      text: "Anyways... To become even stronger, I need protein! Ant eggs are so legendary full of protein, I believe they can give even more amazing muscles! So I will trade your Queen many sticks for her eggs!",
                      responses: [
                        {
                          text: "What? That's so messed up! Our eggs aren't for sale! No way! Get outta here now!",
                          next: {
                            name: "Heracles the Mighty",
                            icon: "img/beetle.png",
                            text: "I-is that s-so... b-but what about my... my gains!!! Wahhhh!",
                            responses: [
                              {
                                text: "That's right, scram!",
                                action: heraclesCrying,
                              },
                            ],
                          },
                        },
                        {
                          text: "Sticks you say? I think an arrangement could be made...",
                          next: {
                            name: "Heracles the Mighty",
                            icon: "img/beetle.png",
                            text: "Hurrah! I will be working out over here! Bring me all the eggs you can!",
                            responses: [
                              {
                                text: "Alright, deal.",
                                action: heraclesInCamp,
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
        {
          text: "This is the second encounter with Heracles the Mighty",
          responses: [
            {
              text: "Oh it's you again...",
              next: {
                text: "Probably him vying for more ants",
                responses: [
                  {
                    text: "No way hose",
                    next: {
                      text: "I-is that s-so... b-but what about my... my gains!!! Wahhhh!",
                      responses: [
                        {
                          text: "That's right, scram!",
                          action: heraclesCrying,
                        },
                      ],
                    },
                  },
                  {
                    text: "Did you say sticks?",
                    next: {
                      text: "Hurrah! I will be working out over here! Bring me all the eggs you can!",
                      responses: [
                        {
                          text: "Alright, deal.",
                          action: heraclesInCamp,
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  ];
  