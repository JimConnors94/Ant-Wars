/* 


 Colony population:

    Every second, one egg is added to players inventory.

    Hatching an ant cost one egg.

    if a Worker type ant is hatched, one ant is created with the following stats:

    Attack: 1
    Defence: 1
    Food gathering: 1 food per second 
    Food cost: 1

    if a Guard type ant is hatched, one ant is created with the following stats:

    Attack: 8
    Defence: 16
    Food gathering: 1/10 food per second 
    Food cost: 8

    if a Warrior type ant is hatched, one ant is created with the following stats:

    Attack: 16
    Defence: 8
    Food gathering: 1/10 food per second 
    Food cost: 8


 Food system:

    Gathering

        Food is gathered every second and added to food store.

        The total food gathered each second is equal to the sum of all colonys ant's food gathering stats. 

        Food gathered is in fractions, but only the floor of the number appears to the player.

    

    Food costs


        Every 10 seconds food is deducted from food store. 

        Fractions are ignored. Only the floor of the number is used. 

        Food deducted is equal to the sum of food cost stat of all colonys ants.

        If food cost is greater than the food stores, ants will die based on the food deficit.

        Ex. Food store is 23, and food cost is 97, there is a 74 food cost deficit. 

        Ants will die randomly until the food cost of dead ants is greater to or equal the food cost deficit.

        Guard and Warrior ants die before worker ants. 

        If the population of Guard and warrior ants equal zero, food shortage will then affect worker ants.

        ex. 

        In a population distribution of:

            25 Workers 
            5 Guards
            4 Warriors

        4 Warrior and 5 Guard ants die = 72 food cost.

        food deficit is now 2.

        2 Worker ants now die. = 2 food cost

        Food deficit is equal to zero. dying ends. 

        Population is now:

            23 Workers 
            0 Guards
            0 Warriors




     Enemy colony:

        The enemy adds to their population



        









*/




