# Big Data Analyser

Big Data Analyser is a solution which is configured to Work with IDP data source to find trends,predict user usage and highlight possible Data Anomalies.
The Solution uses Google Big Query and Prediction API to do big data analysis.

The Data used for Analysis for this Demo is from IDP's CSLoginHistory Table –
Sample Record Information is as follows :
{
    "ModifiedStamp": "2014-01-01T00:47:32.000Z",
    "CreatedStamp": "2014-01-01T00:47:32.000Z",
    "LoginDate": "2014-01-01T00:47:32.000Z",
    "IpAddress": "168.162.246.202",
    "Application": "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)",
    "Type": 0,
    "SessionUUID": null,
    "loginName": "NJDIBFM.TJMWFSNBO"
}

Part 1. Time Data Analysis : 
1. Show Usage patterns from Login information Such as Browser Usage, Usage Information TimeLine, Event Type comparisons.
2.Also the system Scans through the data to show Data Anomalies and allows the user to analyse such issues further. For example Duplicate Records Present, Large Number of failed request 
 for a particular user from a particular IP which can mean several things such as bulk request gone wrong, Wrong stored password hitting the system with wrong password or possible brute force attack.

Part 2: Using predictive Analysis to enchance Security Checks for a User.
1.The google prediciton APIs classification model is trained with previous user system interaction.These models are used to predict which browser,OS and Location the user is most likely to use to access the system.If any of the parameters differ the system calculates a possible threat percentage . It also takes into account the last login information of the user to cross check if 
the user has started using a new system, different browser or moved to a different location.

### Version
1.0.0 Beta

### Technologies

The Technologies used are as follows

* [Meteor] - The JavaScript App Platform for fast development
* [MongoDB] - For database
* [Angular - Meteor] - Angular two way binding made availbel for Meteor.
* [Angular - Material] - UI boiler plate for googles material desgin lanuage.
* [GoogleChart] - For visualization of Big Data.
* [Big Query] - For Big data analytic.
* [Google Prediction API] - For Machine Learning of User Behaviour.
* 
### Installation
Download meteor for the intended OS www.meteor.com .Clone the repository and run the below commands from Tapas directory.

```
$ meteor update 
```

```
$ meteor  
```
Set up a Google Account with Prediction API and Big Query Enabled.
Load Tables with the Big Data from IDP data base and Change the AUTH 2.0 credentials in the code.
