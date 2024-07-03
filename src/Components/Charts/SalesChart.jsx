import React from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import './SalesChart.css';
import BranchDropdown from '../InputDropdown/BranchDropdown';

class SalesChart extends React.Component {
    constructor(props) {
        super(props);

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed in JavaScript

        this.state = {
            series: [
                { name: 'Physical Sale', data: [] },
                { name: 'Online Sale', data: [] }
            ],
            options: {
                chart: {
                    height: 350,
                    type: 'line',
                    dropShadow: {
                        enabled: true,
                        color: '#000',
                        top: 18,
                        left: 7,
                        blur: 10,
                        opacity: 0.2
                    },
                    toolbar: {
                        show: false
                    }
                },
                colors: ['#2FCF15', '#F79E1B'],
                dataLabels: {
                    enabled: true,
                },
                stroke: {
                    curve: 'smooth'
                },
                title: {
                    text: 'Monthly Sale',
                    align: 'center',
                    style: {
                        fontSize: '22px',
                        fontWeight: 'bold',
                        fontFamily: 'Poppins'
                    }
                },
                grid: {
                    borderColor: '#e7e7e7',
                    row: {
                        colors: ['#f3f3f3', 'transparent'],
                        opacity: 0.5
                    },
                },
                markers: {
                    size: 1
                },
                xaxis: {
                    categories: Array.from({ length: 31 }, (_, i) => (i + 1).toString()), // Days of the month
                    title: {
                        text: 'Days',
                        style: {
                            fontFamily: 'Poppins',
                            fontSize: '1em'
                        }
                    }
                },
                yaxis: {
                    title: {
                        text: 'Sales(Rs)',
                        style: {
                            fontFamily: 'Poppins',
                            fontSize: '1em'
                        }
                    },
                    min: 0,
                    tickAmount: 6,
                    labels: {
                        formatter: (value) => {
                            if (value !== undefined) {
                                return value.toLocaleString();
                            }
                            return '';
                        },
                        style: {
                            fontFamily: 'Poppins'
                        }
                    }
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'right',
                    floating: true,
                    offsetY: -65,
                    offsetX: -5,
                    fontFamily: 'Poppins'
                }
            },
            selectedYear: currentYear,
            selectedMonth: currentMonth,
            totalSales: 0,
            selectedBranch: 'All' // Adding selectedBranch to state
        };
    }

    componentDidMount() {
        this.fetchData(this.state.selectedYear, this.state.selectedMonth, this.state.selectedBranch);
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.selectedYear !== this.state.selectedYear ||
            prevState.selectedMonth !== this.state.selectedMonth ||
            prevState.selectedBranch !== this.state.selectedBranch
        ) {
            this.fetchData(this.state.selectedYear, this.state.selectedMonth, this.state.selectedBranch);
        }
    }
    fetchData = async (year, month, branchName) => {
        try {
            const onlineResponse = await axios.get('http://localhost:8080/daily-online-sales-data', {
                params: { branchName, year, month }
            });

            console.log('Online Sales Data Response:', onlineResponse.data);
            const onlineSalesData = new Array(31).fill(0); // Initialize array with 31 days filled with 0
            onlineResponse.data.data.onlineSalesData.forEach(item => {
                onlineSalesData[item.day - 1] = item.totalAmount;
            });

            const physicalResponse = await axios.get('http://localhost:8080/daily-sales-data-chart', {
                params: { branchName, year, month }
            });

            console.log('Physical Sales Data Response:', physicalResponse.data);
            const physicalSalesData = new Array(31).fill(0); // Initialize array with 31 days filled with 0
            physicalResponse.data.data.salesData.forEach(item => {
                console.log(`Day: ${item.day}, TotalAmount: ${item.totalAmount}`);
                physicalSalesData[item.day - 1] = item.totalAmount;
            });

            console.log('Mapped Online Sales Data:', onlineSalesData);
            console.log('Mapped Physical Sales Data:', physicalSalesData);

            // Calculate the new maximum value for the Y-axis
            const newYMax = Math.max(...onlineSalesData, ...physicalSalesData);

            this.setState({
                series: [
                    { name: 'Physical Sale', data: physicalSalesData },
                    { name: 'Online Sale', data: onlineSalesData }
                ],
                options: {
                    ...this.state.options,
                    yaxis: {
                        ...this.state.options.yaxis,
                        max: newYMax // Update the maximum value dynamically
                    }
                },
                totalSales: this.calculateTotalSales(onlineSalesData) + this.calculateTotalSales(physicalSalesData)
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Calculate total sales amount
    calculateTotalSales(seriesData) {
        return seriesData.reduce((total, value) => total + value, 0);
    }

    handleYearChange = event => {
        const selectedYear = parseInt(event.target.value);
        this.setState({ selectedYear });
    };

    handleMonthChange = event => {
        const selectedMonth = parseInt(event.target.value);
        this.setState({ selectedMonth });
    };

    // Handle Branch Dropdown Change
    handleBranchDropdownChange = (value) => {
        this.setState({ selectedBranch: value });
    };

    render() {
        const currentYear = new Date().getFullYear();
        const { selectedYear, selectedMonth, totalSales } = this.state;
        const years = Array.from(new Array(10), (val, index) => currentYear - index);
        return (
            <div>
                <div className="chart-container">
                    <select value={selectedYear} onChange={this.handleYearChange} className="dropdown-style">
                        {years.map((year, index) => (
                            <option key={index} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                    <select value={selectedMonth} onChange={this.handleMonthChange} className="dropdown-style">
                        <option value={1}>January</option>
                        <option value={2}>February</option>
                        <option value={3}>March</option>
                        <option value={4}>April</option>
                        <option value={5}>May</option>
                        <option value={6}>June</option>
                        <option value={7}>July</option>
                        <option value={8}>August</option>
                        <option value={9}>September</option>
                        <option value={10}>October</option>
                        <option value={11}>November</option>
                        <option value={12}>December</option>
                    </select>
                    <BranchDropdown
                        id="branchName"
                        name="branchName"
                        editable={true}
                        onChange={(value) => this.handleBranchDropdownChange(value)}
                    />
                </div>
                <div id="chart">
                    <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={400} />
                </div>
                <div className="total-sales">
                    <span className="total-sales-amount" style={{ color: '#0377A8', fontWeight: 'bold' }}>Total Sales Amount: </span>
                    <span className="total-sales-value" style={{ color: '#000', fontWeight: 'bold' }}>Rs {totalSales.toLocaleString()}</span>
                </div>
            </div>
        );
    }
}

export default SalesChart;
