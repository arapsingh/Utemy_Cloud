import React, { useEffect } from "react";
import { componentActions, statisticActions } from "../../../redux/slices";
import { Typography } from "@material-tailwind/react";
import { BanknotesIcon, UsersIcon, BookOpenIcon, DocumentCheckIcon } from "@heroicons/react/24/outline";
import StatisticsCard from "../../../components/Card/StatisticsCard";
import { ClockIcon } from "@heroicons/react/24/solid";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import StatisticsChart from "../../../components/Chart/StatisticsBarChart";
import StatisticDonutChart from "../../../components/Chart/StatisticDonutChart";
import StatisticLineChart from "../../../components/Chart/StatisticLineChart";
import MenuCustomAnimation from "./MenuYear";

export function Home() {
    const dispatch = useAppDispatch();
    const totalMoney = useAppSelector((state) => state.statisticSlice.totalMoney);
    const totalCourse = useAppSelector((state) => state.statisticSlice.totalCourse);
    const totalUser = useAppSelector((state) => state.statisticSlice.totalUser);
    const totalInvoice = useAppSelector((state) => state.statisticSlice.totalInvoice);
    const categoryCourse = useAppSelector((state) => state.statisticSlice.categoryCourse);
    const categoryEnrolled = useAppSelector((state) => state.statisticSlice.categoryEnrolled);
    const categoryMoney = useAppSelector((state) => state.statisticSlice.categoryMoney);
    const ratingPercent = useAppSelector((state) => state.statisticSlice.ratingPercent);
    const moneyByMonth = useAppSelector((state) => state.statisticSlice.moneyByMonth);
    const currentYear = new Date().getFullYear();
    useEffect(() => {
        dispatch(componentActions.setAdminNavPlace("dashboard"));
        dispatch(statisticActions.getTotalCourse());
        dispatch(statisticActions.getTotalMoney());
        dispatch(statisticActions.getTotalUser());
        dispatch(statisticActions.getCategoryCourse());
        dispatch(statisticActions.getCategoryEnrolled());
        dispatch(statisticActions.getCategoryMoney());
        dispatch(statisticActions.getRatingPercent());
        dispatch(statisticActions.getMoneyByMonth(currentYear));
        dispatch(statisticActions.getTotalInvoice());
    }, [dispatch]);

    const statisticsCardsData = [
        {
            color: "gray",
            icon: BanknotesIcon,
            title: "Total Money",
            value: `đ${totalMoney?.toLocaleString() || 0}`,
            footer: {
                color: "text-green-500",
                value: "+55%",
                label: "than last week",
            },
        },
        {
            color: "green",
            icon: UsersIcon,
            title: "Total Users",
            value: totalUser || 0,
            footer: {
                color: "text-green-500",
                value: "+3%",
                label: "than last month",
            },
        },
        {
            color: "red",
            icon: BookOpenIcon,
            title: "Total course",
            value: totalCourse || 0,
            footer: {
                color: "text-green-500",
                value: "+5%",
                label: "than yesterday",
            },
        },
        {
            color: "blue-gray",
            icon: DocumentCheckIcon,
            title: "Total order",
            value: totalInvoice || 0,
            footer: {
                color: "text-green-500",
                value: "+5%",
                label: "than yesterday",
            },
        },
    ];

    const statisticDonutData = {
        color: "white",
        title: "Course count in each level of rating",
        description: "Describe how many % of course on Utemy achieve this rating",
        name: "Rating",
        data: ratingPercent.map((rating) => rating.percent),
        categories: ratingPercent.map((rating) => `${rating.title} star`),
        footer: "Update by now",
    };
    const statisticLineData = {
        color: "white",
        colors: ["#775DD0"],
        title: "Total money each month",
        description: "Describe how much each month Utemy earns",
        name: "VNĐ",
        data: moneyByMonth.map((month) => month.total_money_month),
        categories: moneyByMonth.map((month) => month.month_label),
        footer: "Update by now",
    };
    const statisticsChartsData = [
        {
            color: "white",
            colors: "#388e3c",
            title: "Course count in category",
            description: "Describe how many course exist in each category",
            name: "Course",
            data: categoryCourse.map((category) => category.course_count),
            categories: categoryCourse.map((category) => category.title),
            footer: "Update by now",
        },
        {
            color: "white",
            colors: "#0288d1",
            title: "Enrolls count in category",
            description: "Describe number of enrolls in each category",
            name: "Number of enrolled",
            data: categoryEnrolled.map((category) => category.total_enrolled),
            categories: categoryEnrolled.map((category) => category.title),
            footer: "Update by now",
        },
        {
            color: "white",
            colors: "#FF6347",
            title: "Total money count in category",
            description: "Describe total money in each category",
            name: "VNĐ",
            data: categoryMoney.map((category) => category.total_money_from_category),
            categories: categoryMoney.map((category) => category.category_title),
            footer: "Update by now",
        },
    ];

    return (
        <div className="pt-[15px] bg-background_2">
            <div className="mb-12 grid gap-y-10 items-center gap-x-6 md:grid-cols-2 xl:grid-cols-4">
                {statisticsCardsData.map(({ icon, title, footer, ...rest }) => {
                    return (
                        <StatisticsCard
                            key={title}
                            {...rest}
                            title={title}
                            value={rest.value}
                            icon={icon}
                            // icon={React.createElement(icon, {
                            //     className: "w-6 h-6 text-white",
                            // })}
                        />
                    );
                })}
            </div>
            <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
                {statisticsChartsData.map((props: any) => {
                    return (
                        <StatisticsChart
                            key={props.title}
                            {...props}
                            footer={
                                <Typography
                                    variant="small"
                                    className="flex items-center font-normal text-blue-gray-600"
                                >
                                    <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                                    &nbsp;{props.footer}
                                </Typography>
                            }
                        />
                    );
                })}
            </div>
            <div className="mb-4 grid grid-cols-2 gap-6 ">
                <StatisticDonutChart
                    key={statisticDonutData.title}
                    {...statisticDonutData}
                    footer={
                        <Typography variant="small" className="flex items-center font-normal text-blue-gray-600">
                            <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                            &nbsp;{statisticDonutData.footer}
                        </Typography>
                    }
                />
                <StatisticLineChart
                    key={statisticLineData.title}
                    {...statisticLineData}
                    footer={
                        <div className="flex justify-between">
                            <Typography variant="small" className="flex items-center font-normal text-blue-gray-600">
                                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                                &nbsp;{statisticLineData.footer}
                            </Typography>
                            <div className="flex gap-2">
                                <Typography
                                    variant="small"
                                    className="flex items-center font-normal text-blue-gray-600"
                                >
                                    Choose year
                                </Typography>
                                <MenuCustomAnimation />
                            </div>
                        </div>
                    }
                />
            </div>
        </div>
    );
}

export default Home;
