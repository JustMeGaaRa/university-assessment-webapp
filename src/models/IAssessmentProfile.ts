import { IQuestion } from "./IQuestion";
import { ICompetency } from "./ICompetency";

export interface IAssessmentProfile {
    id: number;
    name: string;
    creationDate: Date;
    competencies: ICompetency[];
    questions: IQuestion[];
}