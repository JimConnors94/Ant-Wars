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
  {
    name: "Mantis the Elusive",
    icon: "img/mantis.png",
    music: "audio/mantisMusic.wav",
    encounters: [
      {
        text: "A nervous mantis darts into the ant colony, looking over his shoulder. He whispers, 'Please, I need your help! My girlfriend is looking for me, and I need a place to hide!'",
        responses: [
          {
            text: "Why are you hiding from your girlfriend?",
            next: {
              name: "Mantis the Elusive",
              icon: "img/mantis.png",
              text: "She's... intense. Always wants to cuddle, and if she catches me, she won't let me go for hours! I just need a break, okay? Help me hide, and I'll teach your warriors some of my deadly mantis techniques!",
              responses: [
                {
                  text: "Fine, we'll help you hide. But you better teach us something useful!",
                  next: {
                    name: "Mantis the Elusive",
                    icon: "img/mantis.png",
                    text: "Thank you! Quick, let me blend in with your workers. And remember, if a very angry mantis comes looking for me, you haven't seen me!",
                    responses: [
                      {
                        text: "Alright, get in line. But don't make this a habit.",
                        action: mantisInCamp,
                      },
                    ],
                  },
                },
                {
                  text: "No way! We don't want your girlfriend mad at us! Get out of here!",
                  next: {
                    name: "Mantis the Elusive",
                    icon: "img/mantis.png",
                    text: "You're making a huge mistake! She's going to find me anyway, and when she does, she'll be furious!",
                    responses: [
                      {
                        text: "Not our problem. Scram!",
                        action: mantisFlees,
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            text: "We don't have time for this! Get out of here!",
            next: {
              name: "Mantis the Elusive",
              icon: "img/mantis.png",
              text: "You'll regret this! She's going to find me, and when she does, she'll take it out on you!",
              responses: [
                {
                  text: "We'll take our chances. Now leave!",
                  action: mantisFlees,
                },
              ],
            },
          },
        ],
      },
      {
        text: "Mantis the Elusive is back, looking even more panicked than before. 'She's closer! Please, I need a better hiding spot!'",
        responses: [
          {
            text: "We already helped you once. What's in it for us this time?",
            next: {
              name: "Mantis the Elusive",
              icon: "img/mantis.png",
              text: "I'll teach your warriors an advanced mantis technique! It's called the 'Blade of a Thousand Cuts'! Just... please, hide me!",
              responses: [
                {
                  text: "Fine, but this is the last time!",
                  action: mantisInCamp,
                },
              ],
            },
          },
          {
            text: "No way! You're on your own this time!",
            next: {
              name: "Mantis the Elusive",
              icon: "img/mantis.png",
              text: "You're heartless! Fine, I'll find somewhere else to hide... but don't come crying to me when she starts asking questions!",
              responses: [
                {
                  text: "Good riddance!",
                  action: mantisFlees,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    name: "Caterpillar the Silkweaver",
    icon: "img/caterpillar.png",
    music: "audio/caterpillarMusic.wav",
    encounters: [
      {
        text: "A plump caterpillar waddles up to the ants, carrying a bundle of silk. 'Greetings, ants! I have a proposition for you. I can trade my silk for some of your food. What do you say?'",
        responses: [
          {
            text: "What kind of silk do you have, and what do you want in return?",
            next: {
              name: "Caterpillar the Silkweaver",
              icon: "img/caterpillar.png",
              text: "My silk is the finest in the land! It's strong, lightweight, and perfect for building or repairing your nests. In exchange, I just need some of your stored food. A fair trade, don't you think?",
              responses: [
                {
                  text: "That sounds useful. We'll trade some food for your silk.",
                  next: {
                    name: "Caterpillar the Silkweaver",
                    icon: "img/caterpillar.png",
                    text: "Wonderful! Here's the silk. I'll be back with more when I need more food. Pleasure doing business with you!",
                    responses: [
                      {
                        text: "Likewise. Safe travels!",
                        action: caterpillarInCamp,
                      },
                    ],
                  },
                },
                {
                  text: "We don't need your silk. We have plenty of materials already.",
                  next: {
                    name: "Caterpillar the Silkweaver",
                    icon: "img/caterpillar.png",
                    text: "Oh... well, if you change your mind, you know where to find me. Goodbye for now!",
                    responses: [
                      {
                        text: "Farewell.",
                        action: caterpillarLeaves,
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            text: "We don't trust outsiders. Get out of here!",
            next: {
              name: "Caterpillar the Silkweaver",
              icon: "img/caterpillar.png",
              text: "Oh dear, that's unfortunate. I mean no harm, but I'll be on my way. Goodbye!",
              responses: [
                {
                  text: "Good riddance!",
                  action: caterpillarLeaves,
                },
              ],
            },
          },
        ],
      },
      {
        text: "The caterpillar returns, carrying another bundle of silk. 'Hello again! I have more silk to trade. Are you interested?'",
        responses: [
          {
            text: "We could use more silk. What do you want this time?",
            next: {
              name: "Caterpillar the Silkweaver",
              icon: "img/caterpillar.png",
              text: "Same as before—some of your stored food. I promise, this silk is even better than the last batch!",
              responses: [
                {
                  text: "Alright, let's trade.",
                  action: caterpillarInCamp,
                },
              ],
            },
          },
          {
            text: "We don't need any more silk. Go away!",
            next: {
              name: "Caterpillar the Silkweaver",
              icon: "img/caterpillar.png",
              text: "Oh... very well. I'll take my silk elsewhere. Goodbye!",
              responses: [
                {
                  text: "Don't let the door hit you on the way out!",
                  action: caterpillarLeaves,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    name: "Mantissa the Fierce",
    icon: "img/female_mantis.png",
    music: "audio/mantissaMusic.wav",
    encounters: [
      {
        text: "A female mantis storms into the ant colony, her eyes blazing with determination. 'Where is he?! I know he's here! That slippery little coward can't hide from me forever!'",
        responses: [
          {
            text: "Who are you talking about?",
            next: {
              name: "Mantissa the Fierce",
              icon: "img/female_mantis.png",
              text: "Don't play dumb with me! My beloved Mantis the Elusive! I saw him scurry in here, and I know you're hiding him. Hand him over, or I'll tear this place apart!",
              responses: [
                {
                  text: "We don't know what you're talking about. He's not here.",
                  next: {
                    name: "Mantissa the Fierce",
                    icon: "img/female_mantis.png",
                    text: "Liar! I can smell his fear from here! If you don't give him to me, I'll start flipping over every rock and leaf in this colony until I find him!",
                    responses: [
                      {
                        text: "Fine, fine! He's here. But don't hurt us!",
                        next: {
                          name: "Mantissa the Fierce",
                          icon: "img/female_mantis.png",
                          text: "That's more like it. Now, where is he?",
                          responses: [
                            {
                              text: "He's hiding in the worker line. Over there.",
                              action: mantissaFindsMantis,
                            },
                          ],
                        },
                      },
                      {
                        text: "We won't betray him! You'll have to go through us first!",
                        next: {
                          name: "Mantissa the Fierce",
                          icon: "img/female_mantis.png",
                          text: "Brave, but foolish. If you won't give him up, I'll just have to take him by force!",
                          responses: [
                            {
                              text: "Stand your ground! Protect the colony!",
                              action: mantissaAttack,
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  text: "Okay, he's here. But why are you so desperate to find him?",
                  next: {
                    name: "Mantissa the Fierce",
                    icon: "img/female_mantis.png",
                    text: "Because he's mine! We're meant to be together, but he keeps running away! I just want to love him... and maybe nibble on him a little. Is that so wrong?",
                    responses: [
                      {
                        text: "Uh... that sounds... intense. We'll hand him over.",
                        action: mantissaFindsMantis,
                      },
                      {
                        text: "That's terrifying. We're not helping you!",
                        next: {
                          name: "Mantissa the Fierce",
                          icon: "img/female_mantis.png",
                          text: "Then I'll take him by force! Prepare yourselves!",
                          responses: [
                            {
                              text: "We won't let you harm our colony!",
                              action: mantissaAttack,
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
          {
            text: "We don't know who you're talking about. Leave now!",
            next: {
              name: "Mantissa the Fierce",
              icon: "img/female_mantis.png",
              text: "You dare lie to me?! I'll tear this place apart until I find him!",
              responses: [
                {
                  text: "We won't let you harm our colony!",
                  action: mantissaAttack,
                },
              ],
            },
          },
        ],
      },
    ],
  },
];