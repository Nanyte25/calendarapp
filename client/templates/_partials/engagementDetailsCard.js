Template.engagementDetailsCard.onRendered(function () {
	Meteor.subscribe("engineers");
	Meteor.subscribe("dams");
})

Template.engagementDetailsCard.helpers({
	getEngineerPicture : function (id) {
		var eng = Engineers.findOne({_id : id});
		if (!eng) {return ;}
		return eng.picture;
	},
	getDamPicture : function (id) {
		var dam = Dams.findOne({_id : id});
		if (!dam) { return ;}
		return dam.picture;
	},
	createdBy : function () {
		var user = Meteor.users.findOne({_id : this.createdBy});
		if (!user) { 
			return false; 
		}
		return user.username;
	},
	getGameTitleProduct : function () {
		var gameTitle = this.gameTitle;
		if (!gameTitle) { return ; }
		return GameTitles.findOne(gameTitle.id).product;
	},
	getGameTitleCodename : function () {
		var gameTitle = this.gameTitle;
		if (!gameTitle) { return ; }
		return GameTitles.findOne(gameTitle.id).codename;
	},
	getGoals : function () {
		if (this.goals == undefined) { return; }
		return _.map(this.goals, function (goal) { return  { goal : goal }; });
	},
	getEngineerData : function (id) {
		var eng = Engineers.findOne({_id : id});
		if (!eng) {return ;}
		if (popupTimer) { clearTimeout(popupTimer); }
		popupTimer = setTimeout(function() {
		$('.ui.avatar.image').popup();
	}, 500);
		return  { 
					name : eng.name,
				  	picture : eng.picture 
				};	
	},
	getDamData : function (id) {
		var dam = Dams.findOne({_id : id});
		if (!dam) { return ;}
		return  { 
					name : dam.name,
				  	picture : dam.picture 
				};	
	},
})

var popupTimer;