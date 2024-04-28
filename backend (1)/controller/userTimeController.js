const userTimeSModule = require("../moduls/userTime");
const moment = require("moment");


const userActuveTime = async (req, res) => {
    function calculateTotalBreakTime(breakArray) {
       
        const totalBreakTime = moment.duration(0);
    
   
        breakArray.forEach(breakDuration => {
            const durationParts = breakDuration.split(' ');
            const hours = parseInt(durationParts[0]);
            const minutes = parseInt(durationParts[2]);
            totalBreakTime.add({ hours, minutes });
        });
       
        return totalBreakTime;
    }
    function calculateTimeDifference(startTime, endTime) {
        const timeFormat = 'hh:mm A';
        const startTimeObj = moment(startTime, timeFormat);
        let endTimeObj = moment(endTime, timeFormat);
            if (endTimeObj.isBefore(startTimeObj) && endTimeObj.format('A') === 'AM') {
            endTimeObj.add(1, 'day');
        }
        const timeDifference = moment.duration(endTimeObj.diff(startTimeObj));
        return `${timeDifference.hours()} hours ${timeDifference.minutes()} minutes`;
    }
    try {
        const { userDate } = req.body;
        const backendTimeSheet = await userTimeSModule.find({});
        
        let currentDate = new Date();
        currentDate.setSeconds(0);
        const currentTimeWithoutSeconds = new Date(currentDate);
  const formattedTime = currentTimeWithoutSeconds.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  console.log("hello", formattedTime ,userDate[0].year.month[0].date[0].logout[0]);
  if(`${formattedTime}` !==`${userDate[0].year.month[0].date[0].logout[0]}`){
        console.log("hacker h bhai hacker");
        return;
  }
        if (backendTimeSheet.length > 0) {
            const oldDocumentId = backendTimeSheet[0]._id;
            let oldLoginTime = backendTimeSheet[0].userDate;
            let MainTimeSheet = oldLoginTime[oldLoginTime.length - 1];
            if (MainTimeSheet.year.current === userDate[0].year.current) {
                let monthTimeSheet = MainTimeSheet.year.month;

                if (monthTimeSheet[monthTimeSheet.length - 1].current === userDate[0].year.month[0].current) {
                    let dateTimeSheet = monthTimeSheet[monthTimeSheet.length - 1].date;
                        console.log(dateTimeSheet[dateTimeSheet.length - 1].current, userDate[0].year.month[0].date[0].current)
                    if (dateTimeSheet[dateTimeSheet.length - 1].current === userDate[0].year.month[0].date[0].current) {
                        console.log(dateTimeSheet[dateTimeSheet.length - 1])
                      if(userDate[0].year.month[0].date[0].login[0]){
                        let oldBreakSheet = dateTimeSheet[dateTimeSheet.length - 1].break;
                            let loginTimeSheet = dateTimeSheet[dateTimeSheet.length - 1].login;
                         
                        let currentDateSheet = userDate[0].year.month[0].date[0].login[0];
                   
                       
                        loginTimeSheet.push(currentDateSheet);
                       
                        let loginArray = oldLoginTime[oldLoginTime.length - 1].year.month[oldLoginTime[oldLoginTime.length - 1].year.month.length - 1].date[oldLoginTime[oldLoginTime.length - 1].year.month[oldLoginTime[oldLoginTime.length - 1].year.month.length - 1].date.length - 1].login;
                        let logoutArray = oldLoginTime[oldLoginTime.length - 1].year.month[oldLoginTime[oldLoginTime.length - 1].year.month.length - 1].date[oldLoginTime[oldLoginTime.length - 1].year.month[oldLoginTime[oldLoginTime.length - 1].year.month.length - 1].date.length - 1].logout;
                        if(loginArray.length>0 && logoutArray.length>0){
                            const time2 = "09:30 AM";
                            const time1 = "06:30 PM"
                            const time1Obj = new Date(`2000-01-01 ${loginArray[0]}`);
                            const time2Obj = new Date(`2000-01-01 ${time2}`);
                            const time3Obj = new Date(`2000-01-01 ${time1}`);
                            const time4Obj = new Date(`2000-01-01 ${logoutArray[logoutArray.length-1]}`);
                        const isBefore930AM = time1Obj < time2Obj;
                          console.log(isBefore930AM)
                        const isAfter700PM = time4Obj>time3Obj;
                        console.log(isAfter700PM)
                            if(isBefore930AM  && isAfter700PM){
                                dateTimeSheet[dateTimeSheet.length - 1].status= "Present"
                            }else if(isBefore930AM  || isAfter700PM){
                                dateTimeSheet[dateTimeSheet.length - 1].status= "Half Day"
                            }else{
                                dateTimeSheet[dateTimeSheet.length - 1].status= "absent"
                            }
                        }else if(loginArray.length>0){
                            const time2 = "09:30 AM";
                          
                            const time1Obj = new Date(`2000-01-01 ${loginArray[0]}`);
                            const time2Obj = new Date(`2000-01-01 ${time2}`);
                        
                  
                        const isBefore930AM = time1Obj < time2Obj;
                          console.log(isBefore930AM)
                    
                   
                       if(isBefore930AM){
                                dateTimeSheet[dateTimeSheet.length - 1].status= "Half Day"
                            }else{
                                dateTimeSheet[dateTimeSheet.length - 1].status= "absent"
                            }
                        }
                        if((loginArray.length>logoutArray.length )&& logoutArray.length>0){
                           
                            let breakTime  = calculateTimeDifference(logoutArray[logoutArray.length-1], loginArray[loginArray.length-1]);

                        
                           console.log(breakTime)
                           oldBreakSheet.push(breakTime);

                           if(oldBreakSheet.length>1){
                            
                     
                            totalBreakTime = calculateTotalBreakTime(oldBreakSheet)
                            let hours = totalBreakTime.hours();
                            let minutes = totalBreakTime.minutes();
                            dateTimeSheet[dateTimeSheet.length - 1].totalBreakTime= `${hours} hours ${minutes} minutes`
                           }else{
                            dateTimeSheet[dateTimeSheet.length - 1].totalBreakTime=breakTime
                           }
                           
                        }
                        await userTimeSModule.updateOne(
                            { _id: oldDocumentId },
                            { $set: { userDate: oldLoginTime } }
                        );

                        res.status(200).json({
                            message: 'User Login time sheet updated successfully',
                            userTime: dateTimeSheet[dateTimeSheet.length - 1],
                        });

                        }else{
                        console.log(dateTimeSheet[dateTimeSheet.length - 1]);
                        let logoutTimeSheet = dateTimeSheet[dateTimeSheet.length - 1].logout;
                        let currentDateSheet = userDate[0].year.month[0].date[0].logout[0];
                       
                        logoutTimeSheet.push(currentDateSheet);

                        let logoutArray = oldLoginTime[oldLoginTime.length - 1].year.month[oldLoginTime[oldLoginTime.length - 1].year.month.length - 1].date[oldLoginTime[oldLoginTime.length - 1].year.month[oldLoginTime[oldLoginTime.length - 1].year.month.length - 1].date.length - 1].logout;
                        let loginArray = oldLoginTime[oldLoginTime.length - 1].year.month[oldLoginTime[oldLoginTime.length - 1].year.month.length - 1].date[oldLoginTime[oldLoginTime.length - 1].year.month[oldLoginTime[oldLoginTime.length - 1].year.month.length - 1].date.length - 1].login;
                        if(loginArray.length>0 && logoutArray.length>0){
                            const time2 = "09:30 AM";
                            const time1 = "06:30 PM"
                            const time1Obj = new Date(`2000-01-01 ${loginArray[0]}`);
                            const time2Obj = new Date(`2000-01-01 ${time2}`);
                            const time3Obj = new Date(`2000-01-01 ${time1}`);
                            const time4Obj = new Date(`2000-01-01 ${logoutArray[logoutArray.length-1]}`);
                        const isBefore930AM = time1Obj < time2Obj;
                          console.log(isBefore930AM)
                        const isAfter700PM = time4Obj>time3Obj;
                            if(isBefore930AM  && isAfter700PM){
                                dateTimeSheet[dateTimeSheet.length - 1].status= "Present"
                            }else if(isBefore930AM  || isAfter700PM){
                                dateTimeSheet[dateTimeSheet.length - 1].status= "Half Day"
                            }else{
                                dateTimeSheet[dateTimeSheet.length - 1].status= "absent"
                            }
                        }
                       
                        await userTimeSModule.updateOne(
                            { _id: oldDocumentId },
                            { $set: { userDate: oldLoginTime } }
                        );

                        res.status(200).json({
                            message: 'User logout time sheet updated successfully',
                            userTime: dateTimeSheet[dateTimeSheet.length - 1],
                        });

                        }
                    } else {
                        let currentDateSheet = userDate[0].year.month[0].date[0];
                        dateTimeSheet.push(currentDateSheet);
                        
                        let loginArray = oldLoginTime[oldLoginTime.length - 1].year.month[oldLoginTime[oldLoginTime.length - 1].year.month.length - 1].date[oldLoginTime[oldLoginTime.length - 1].year.month[oldLoginTime[oldLoginTime.length - 1].year.month.length - 1].date.length - 1].login;
                        if(loginArray.length>0){
                            const time2 = "09:30 AM";
                          
                            const time1Obj = new Date(`2000-01-01 ${loginArray[0]}`);
                            const time2Obj = new Date(`2000-01-01 ${time2}`);
                        
                  
                        const isBefore930AM = time1Obj < time2Obj;
                          console.log(isBefore930AM)
                    
                   
                       if(isBefore930AM){
                                dateTimeSheet[dateTimeSheet.length - 1].status= "Half Day"
                            }else{
                                dateTimeSheet[dateTimeSheet.length - 1].status= "absent"
                            }
                        }
                        await userTimeSModule.updateOne(
                            { _id: oldDocumentId },
                            { $set: { userDate: oldLoginTime } }
                        );

                        res.status(200).json({
                            message: 'User Date time sheet updated successfully',
                            userTime: dateTimeSheet[dateTimeSheet.length - 1],
                        });
                    }

                } else {
                    let currentMonthSheet = userDate[0].year.month[0];
                    monthTimeSheet.push(currentMonthSheet);
                    let dateTimeSheet = monthTimeSheet[monthTimeSheet.length - 1].date;
                    let loginArray = oldLoginTime[oldLoginTime.length - 1].year.month[oldLoginTime[oldLoginTime.length - 1].year.month.length - 1].date[oldLoginTime[oldLoginTime.length - 1].year.month[oldLoginTime[oldLoginTime.length - 1].year.month.length - 1].date.length - 1].login;
                   
                    if(loginArray.length>0){
                        const time2 = "09:30 AM";
                      
                        const time1Obj = new Date(`2000-01-01 ${loginArray[0]}`);
                        const time2Obj = new Date(`2000-01-01 ${time2}`);
                    
              
                    const isBefore930AM = time1Obj < time2Obj;
                      console.log(isBefore930AM)
                
               
                   if(isBefore930AM){
                            dateTimeSheet[dateTimeSheet.length - 1].status= "Half Day"
                        }else{
                            dateTimeSheet[dateTimeSheet.length - 1].status= "absent"
                        }
                    }
                    
                        
                    await userTimeSModule.updateOne(
                        { _id: oldDocumentId },
                        { $set: { userDate: oldLoginTime } }
                    );

                    res.status(200).json({
                        message: 'User Month time sheet updated successfully',
                        userTime: dateTimeSheet[dateTimeSheet.length - 1],
                    });
                }

            } else {
                console.log(userDate[0]);
                oldLoginTime.push(userDate[0]);
                let MainTimeSheet = oldLoginTime[oldLoginTime.length - 1];
                let monthTimeSheet = MainTimeSheet.year.month;
                let dateTimeSheet = monthTimeSheet[monthTimeSheet.length - 1].date;
                let loginArray = oldLoginTime[oldLoginTime.length - 1].year.month[oldLoginTime[oldLoginTime.length - 1].year.month.length - 1].date[oldLoginTime[oldLoginTime.length - 1].year.month[oldLoginTime[oldLoginTime.length - 1].year.month.length - 1].date.length - 1].login;
                    console.log(dateTimeSheet);
                    console.log("login", loginArray)
                if(loginArray.length>0){
                    const time2 = "09:30 AM";
                  
                    const time1Obj = new Date(`2000-01-01 ${loginArray[0]}`);
                    const time2Obj = new Date(`2000-01-01 ${time2}`);
                
          
                const isBefore930AM = time1Obj < time2Obj;
                  console.log(isBefore930AM)
            
           
               if(isBefore930AM){
                        dateTimeSheet[dateTimeSheet.length - 1].status= "Half Day"
                    }else{
                        dateTimeSheet[dateTimeSheet.length - 1].status= "absent"
                    }
                }

                await userTimeSModule.updateOne(
                    { _id: oldDocumentId },
                    { $set: { userDate: oldLoginTime } }
                );

               

                res.status(200).json({
                    message: 'User Year time sheet updated successfully',
                    userTime: dateTimeSheet[dateTimeSheet.length - 1],
                });
            }
        } else {
            const newUserTime = new userTimeSModule({ userDate });
           let loginArray = newUserTime.userDate[0].year.month[0].date[0];
           console.log("dates" , loginArray)
           
            if(loginArray.login.length>0){
                const time2 = "09:30 AM";
              
                const time1Obj = new Date(`2000-01-01 ${loginArray.login[0]}`);
                const time2Obj = new Date(`2000-01-01 ${time2}`);
            
      
            const isBefore930AM = time1Obj < time2Obj;
              console.log(isBefore930AM)
        
       
           if(isBefore930AM){
            loginArray.status= "Half Day"
                }else{
                    loginArray.status= "absent"
                }
            }

            await newUserTime.save();

            res.status(201).json({
                message: 'User is logged in',
                userTime: loginArray,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

const finduserActiveTime = async (req, res) => {
    try {
        const findtime = await userTimeSModule.find({});
        res.status(200).json({
            message: 'Data is found',
            data: findtime
        });
    } catch (error) {
        res.status(500).json({
            message: 'Active time find request failed',
            error: error.message,
        });
    }
};

const updateTime = async (req, res) => {
    const UpdatedTime = req.body;
    const findtime = await userTimeSModule.find({});

    try {
        await userTimeSModule.findByIdAndUpdate(UpdatedTime);
        const updateTime = await userTimeSModule.findOne({ _id: id });
        res.status(200).json({
            message: 'Your time is updated',
            updateTime: updateTime,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Active time update request failed',
            error: error.message,
        });
    }
};

module.exports = {
    userActuveTime,
    finduserActiveTime,
    updateTime
};
