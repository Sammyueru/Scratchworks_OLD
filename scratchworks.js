class Scratchworks {
    constructor (runtime, win) {
		this.runtime = runtime;
        this.win = win;
        this.document = win.document;
        this.requireJS = win.document.createElement('require.js');
        this.greenworks = require(['./greenworks']);
    }

    getInfo() {
        return {
            "id": "Scratchworks",
            "name": "Scratchworks - Steamworks for TurboWarp",

            "blocks": [
                {
                    opcode: 'initScratchworks',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'General: Initialize Scratchworks',
                },
                {
                    opcode: 'mySteamId DOES NOT WORK YET',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'General: Players Steam ID'
                },
                {
                    opcode: 'hasSteamAppOwnership',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'Auth: Has Steam Application Ownership of [STEAMAPPID] with Secret Key of [SECRETKEY]',
                    arguments: {
                        STEAMAPPID: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 480
                        },
                        SECRETKEY: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: ''
                        }
                    }
                },
                {
                    opcode: 'getStat',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'Stats: Get Stat [STATNAME] | is it a float: [ISFLOAT]',
                    arguments: {
                        STATNAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: ""
                        },
                        ISFLOAT: {
                            type: Scratch.ArgumentType.BOOLEAN,
                            defaultValue: false
                        }
                    }
                },
                {
                    opcode: 'setStat',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'Stats: Set Stat [STATNAME] to [STATDATA]',
                    arguments: {
                        STATNAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: ""
                        },
                        STATDATA: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: ""
                        }
                    }
                },
                {
                    opcode: 'storeStat',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Stats: Store Stats on Steams servers',
                },
                {
                    opcode: 'awardAchievement',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Achievement: Award Achievement [ACHIEVEMENT]',
                    arguments: {
                        ACHIEVEMENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: ''
                        },
                    }
                },
                {
                    opcode: 'ownsAchievement',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'Achievement: Owns [ACHIEVEMENT]',
                    arguments: {
                        ACHIEVEMENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: ''
                        },
                    }
                },
                {
                    opcode: 'indicateAchievementProgress',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Achievement: Indicate [ACHIEVEMENT] Progress | Progress: [PROGRESS], Max: [MAX]',
                    arguments: {
                        ACHIEVEMENT: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: ''
                        },
                        PROGRESS: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        MAX: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                {
                    opcode: 'createLobby',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'Matchmaking: Create Lobby | Lobby Type: [LOBBYTYPE], Max Members: [MAXMEMBERS]',
                    arguments: {
                        LOBBYTYPE: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        MAXMEMBERS: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 4
                        },
                    }
                },
            ]
        };
    };

    //Steam General:
    initScratchworks()
    {
        if(greenworks.init())
        {
            return true;
        }
        return false;
    }

    mySteamId()
    {

    }

    //Steam Authority:
    hasSteamAppOwnership(args)
    {
        greenworks.getEncryptedAppTicket('test_content', function(ticket) {
            console.log("ticket: " + ticket.toString('hex'));
            var keyArray = [];
            var secretKeyToSplit = args.SECRETKEY.replaceAll(' ', '');
            var keyArrayStr = secretKeyToSplit.split(",");
            var i = 0;
            foreach(str in keyArrayStr)
            {
                keyArray[i] = parseInt(str, 16);
                
                i++;
            }

            var key = new Buffer.from(keyArray);

            // Specify the secret key.
            //var key = new Buffer(32);
            // TODO: you must initialize Buffer key with the secret key of your game here,
            // e.g. key = new Buffer([0x0a, ..., 0x0b]).
            assert(key.length == greenworks.EncryptedAppTicketSymmetricKeyLength)
            var decrypted_app_ticket = greenworks.decryptAppTicket(ticket, key);
            if (decrypted_app_ticket) {
              return (greenworks.isTicketForApp(decrypted_app_ticket, args.STEAMAPPID));
              //            greenworks.getAppId()));
              //console.log(greenworks.getTicketAppId(decrypted_app_ticket));
              //console.log(greenworks.getTicketSteamId(decrypted_app_ticket));
              //console.log(greenworks.getTicketIssueTime(decrypted_app_ticket));
            }
        }, function(err) { throw err; });
    }

    //Steam Stats:
    getStat(args)
    {
        if(args.ISFLOAT)
        {
            return greenworks.getStatFloat(args.STATNAME);
        }
        else
        {
            return greenworks.getStatInt(args.STATNAME);
        }
    }

    setStat(args)
    {
        return greenworks.setStat(args.STATNAME, args.STATDATA);
    }

    storeStat()
    {
        greenworks.storeStats();
    }

    //Steam Achievements:
    awardAchievement(args)
    {
        greenworks.activateAchievement(args.ACHIEVEMENT);
    }

    ownsAchievement(args)
    {
        return greenworks.getAchievement(args.ACHIEVEMENT);
    }

    indicateAchievementProgress(args)
    {
        greenworks.indicateAchievementProgress(args.ACHIEVEMENT, args.PROGRESS, args.MAX);
    }

    //Steam Matchmaking:
    createLobby(args)
    {
        var createLobbyType;

        if(args.LOBBYTYPE == 1)
        {
            createLobbyType = greenworks.ELobbyType.Private;
        }
        else if(args.LOBBYTYPE == 2)
        {
            createLobbyType = greenworks.ELobbyType.FriendsOnly;
        }
        else if(args.LOBBYTYPE == 3)
        {
            createLobbyType = greenworks.ELobbyType.Public;
        }
        else if(args.LOBBYTYPE == 4)
        {
            createLobbyType = greenworks.ELobbyType.Invisible;
        }
        else
        {
            return false;
        }

        if(greenworks.createLobby(createLobbyType, args.MAXMEMBERS) == greenworks.EResult.OK)
        {
            return true;
        }
    }
}

(function() {
    var extensionInstance = new Scratchworks(window.vm.extensionManager.runtime, window)
    var serviceName = window.vm.extensionManager._registerInternalExtension(extensionInstance)
    window.vm.extensionManager._loadedExtensions.set(extensionInstance.getInfo().id, serviceName)
})()
//Scratch.extensions.register(new Scratchworks());