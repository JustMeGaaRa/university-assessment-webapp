import * as React from "react";
import { Segment, Divider, Header, Button, Form, ButtonProps, InputOnChangeData, Card, CardProps } from "semantic-ui-react";
import { loadCompetencies, createCompetency } from "src/store/competencies.actions";
import { ICompetency } from "src/models/ICompetency";
import CompetencySegment from "./competency-segment";

interface ICompetenciesPageState {
    competencies: ICompetency[];
    competencyName: string;
    selectedCompetencyId?: number;
    selectedCompetencies: ICompetency[];
}

class CompetencyPage extends React.Component<any, ICompetenciesPageState> {
    constructor(props: any) {
        super(props);

        this.handleOnInputChange = this.handleOnInputChange.bind(this);
        this.handleOnAddButton = this.handleOnAddButton.bind(this);

        this.state = {
            competencies: [],
            competencyName: "",
            selectedCompetencies: []
        };
    }

    public render() {
        const header = "Competencies";
        const subheader = "Create and manage competencies, subcompetencies and indicators.";
        const { competencies, selectedCompetencies: selectedCompetency } = this.state;
        const addButtonDisabled = this.state.competencyName === "";
        const inputAction = <Button content='Add' disabled={addButtonDisabled} onClick={this.handleOnAddButton} />;
        const inputProps = {
            action: inputAction,
            icon: "edit outline",
            label: "Competency Name",
            placeholder: "Enter competency name..."
        };

        return (
            <Segment>
                <Header as='h1' content={header} subheader={subheader} />
                <Divider hidden />
                <Form>
                    <Form.Input {...inputProps} iconPosition="left" onChange={this.handleOnInputChange} />
                </Form>
                <Divider hidden />
                <Card.Group>
                    {competencies.map(competency => (
                    <Card 
                        key={competency.competencyId}
                        color={this.getSelectedColor(competency.competencyId)}
                        header={competency.name} 
                        meta={competency.date.toDateString()} 
                        description={competency.description}
                        onClick={this.handleOnSelectCompetency.bind(this, competency)}
                    />))}
                </Card.Group>
                <Divider hidden />

                {selectedCompetency.map(competency => (
                    <CompetencySegment key={competency.competencyId} competency={competency} />
                ))}
            </Segment>
        );
    }

    public componentDidMount() {
        loadCompetencies()
            .then(values => {
                this.setState({
                    competencies: values,
                    selectedCompetencies: values.filter(x => x.competencyId === 1)
                });
            });
    }

    private handleOnInputChange(event: any, data: InputOnChangeData) {
        this.setState({
            competencyName: data.value
        });
    }

    private handleOnSelectCompetency(competency: ICompetency ,event: any, data: CardProps) {
        this.setState({
            selectedCompetencyId: competency.competencyId,
            selectedCompetencies: [competency]
        });
    }

    private handleOnAddButton(event: any, data: ButtonProps) {
        const competency = {
            competencyId: 1,
            name: this.state.competencyName,
            date: new Date(Date.now()),
            description: "",
            subcompetencies: []
        };
        createCompetency(competency)
            .then(values => {
                this.setState({
                    competencies: values
                });
            });
    }

    private getSelectedColor(competencyId: number) {
        return competencyId === this.state.selectedCompetencyId
            ? "blue"
            : undefined;
    }
}

export default CompetencyPage;