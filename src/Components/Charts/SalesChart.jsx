import React from 'react';
import ReactApexChart from 'react-apexcharts';
import './SalesChart.css';
import salesChartData from '../Data.json'; // Import data from Data.json

class SalesChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [],
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
                colors: ['#F79E1B', '#2FCF15'],
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
                    categories: Array.from(Array(32).keys()).map(String),
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
                    max: 1000000, // Set maximum value to 1000000
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
            selectedYear: 2023,
            selectedMonth: 1,
            totalSales: 0
        };
    }

    componentDidMount() {
        // Fetch initial data
        this.fetchData(this.state.selectedYear, this.state.selectedMonth);
    }

    fetchData(year, month) {
        // Fetch data from Data.json file
        const seriesData = salesChartData.salesChartData[year.toString()]; // Access chart data from imported salesChartData
        const totalSales = this.calculateTotalSales(seriesData[month - 1].data);

        this.setState({
            series: seriesData, // Update series state with fetched data
            totalSales
        });
    }

    // Calculate total sales amount
    calculateTotalSales(seriesData) {
        return seriesData.reduce((total, value) => total + value, 0);
    }

    handleYearChange = event => {
        const selectedYear = parseInt(event.target.value);
        this.fetchData(selectedYear, this.state.selectedMonth);
        this.setState({ selectedYear });
    };

    handleMonthChange = event => {
        const selectedMonth = parseInt(event.target.value);
        this.fetchData(this.state.selectedYear, selectedMonth);
        this.setState({ selectedMonth });
    };

    render() {
        const { selectedYear, selectedMonth, totalSales } = this.state;

        return (
            <div>
                <div className="chart-container">
                    <select value={selectedYear} onChange={this.handleYearChange} className="dropdown-style">
                        <option value={2023}>2023</option>
                        <option value={2024}>2024</option>
                        <option value={2025}>2025</option>
                        {/* Add more options for years if needed */}
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