// 1.Find all the topics and tasks which are taught in the month of October;
db.topics.aggregate([
    {
        $lookup: {
            from: "tasks",
            localField: "_id",
            foreignField: "topic_id",
            as: "tasks",
        },
    },
    {
        $match: {
            "tasks.date": {
                $gte: ISODate("2023-10-01"),
                $lte: ISODate("2023-10-31"),
            },
        },
    },
    {
        $project: {
            topic: 1,
            tasks: 1,
        },
    },
]);


// 2.Find all the company drives which appeared between 15th Oct 2020 and 31st Oct 2020
db.company_drives.find({
    date: {
        $gte: ISODate("2020-10-15"),
        $lte: ISODate("2020-10-31"),
    },
});


// 3.Find all the company drives and students who appeared for the placement
db.company_drives.aggregate([
    {
        $lookup: {
            from: "attendance",
            localField: "_id",
            foreignField: "company_drive_id",
            as: "attendance",
        },
    },
    {
        $lookup: {
            from: "users",
            localField: "attendance.user_id",
            foreignField: "_id",
            as: "students",
        },
    },
    {
        $project: {
            drive: "$name",
            students: 1,
        },
    },
]);

// 4.Find the number of problems solved by the user in codekata
db.codekata.aggregate([
    {
        $match: {
            user_id: "<user_id>",
        },
    },
    {
        $group: {
            _id: "$user_id",
            problemsSolved: { $sum: "$problems_solved" },
        },
    },
]);

// 5.Find all the mentors with more than 15 mentees
db.mentors.find({
    $where: "this.mentees.length > 15",
});


// 6.Find the number of users who are absent and tasks are not submitted between 15th Oct 2020 and 31st Oct 2020:
db.attendance.find({
    date: {
        $gte: ISODate("2020-10-15"),
        $lte: ISODate("2020-10-31"),
    },
    status: "absent",
    task_submitted: false,
}).count();
