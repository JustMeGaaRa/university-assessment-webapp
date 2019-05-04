import * as React from "react";
import { Segment, Header, Form, Divider, DropdownProps } from "semantic-ui-react";
import { BarChart, XAxis, YAxis, Legend, Bar, Tooltip, ResponsiveContainer } from "recharts";
import { IProfileReport } from "src/models/IProfileReport";
import { IReportData } from "src/models/IReportData";
import { IReportGroup } from "src/models/IReportGroup";
import { loadUsers } from "src/store/user.actions";
import { calculateProfileReport } from "src/store/report-generation";
import SegmentPlaceholder from "./segment-placeholder";

interface IReportingPageState {
    username: string;
    reports: IProfileReport[];
}

class ReportingPage extends React.Component<any, IReportingPageState> {
    constructor(props: IReportingPageState) {
        super(props);

        this.createCompetencyReportSection = this.createCompetencyReportSection.bind(this);
        this.createGeneralChart = this.createGeneralChart.bind(this);
        this.createCompetencyChart = this.createCompetencyChart.bind(this);
        this.handleOnSearchUserChanged = this.handleOnSearchUserChanged.bind(this);

        this.state = {
            username: "",
            reports: []
        };
    }
    
    public render() {
        const header = "Reporting";
        const subheader = "Reports per user filtered by date.";
        const placeholder = this.state.reports.length === 0;
        const placeholderMessage = "No reports were found. Try different filters.";
        const users = loadUsers().map(user => ({
            key: user.username,
            text: user.fullname,
            value: user.fullname
        }));

        return (
            <Segment>
                <Header as='h1' content={header} subheader={subheader} />
                <Divider hidden />
                <Form>
                    <Form.Group widths='equal'>
                        <Form.Select fluid search label='Target User' options={users} onChange={this.handleOnSearchUserChanged} />
                        <Form.Input fluid label='Target Date' type='date' />
                    </Form.Group>
                </Form>
                <Divider hidden />
                {placeholder && <SegmentPlaceholder message={placeholderMessage} />}
                {!placeholder && this.createReportSection()}
            </Segment>
        );
    }

    private createReportSection() {
        return (this.state.reports.map(report => (
            <Segment.Group key={report.username}>
                {this.createCompetencyReportSection(report.summary)}
                {report.data.map(this.createCompetencyReportSection)}
            </Segment.Group>
        )));
    }

    private createCompetencyReportSection(data: IReportData) {
        return (
            <Segment key={data.competency}>
                <Header as='h2' content={data.competency} subheader={data.description} />
                {this.createGeneralChart(data.general)}
                {this.createCompetencyChart(data.groupped)}
            </Segment>
        );
    }

    private createGeneralChart(group: IReportGroup) {
        return (
            <React.Fragment>
                <Header as='h3' content={group.title} subheader={group.description} />
                <ResponsiveContainer height={400}>
                    <BarChart data={group.data}>
                        <XAxis dataKey='name' />
                        <YAxis />
                        <Tooltip />
                        <Bar fill='#6192bc' dataKey='personal' />
                        <Bar fill='#919397' dataKey='average' />
                    </BarChart>
                </ResponsiveContainer>
            </React.Fragment>
        );
    }

    private createCompetencyChart(group: IReportGroup) {
        return (
            <React.Fragment>
                <Header as='h3' content={group.title} subheader={group.description} />
                <ResponsiveContainer height={400}>
                    <BarChart data={group.data}>
                        <XAxis dataKey='name' />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar fill='#6192bc' dataKey='personal' />
                        <Bar fill='#7db77c' dataKey='supervisor' />
                        <Bar fill='#f3a465' dataKey='colleague' />
                        <Bar fill='#dc7e7f' dataKey='subordinate' />
                        <Bar fill='#a37cca' dataKey='client' />
                    </BarChart>
                </ResponsiveContainer>
            </React.Fragment>
        );
    }

    private handleOnSearchUserChanged(event: any, data: DropdownProps) {
        const userReport = calculateProfileReport(data.value as string, new Date(Date.now()));
        this.setState({
            username: data.value as string,
            reports: [userReport]
        });
    }
}

export default ReportingPage;