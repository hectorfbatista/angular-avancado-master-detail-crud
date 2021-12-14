import { InMemoryDbService } from "angular-in-memory-web-api";

export class InMemoryDataBase implements InMemoryDbService {
    createDb(){
        const categories = [
            { id: 1, nome: 'Moradia', description: "Pagamentos de contas da casa" },
            { id: 1, nome: 'Saúde', description: "Plano de saúde e remédios" },
            { id: 1, nome: 'Lazer', description: "Cinema, parques, praia, etc" },
            { id: 1, nome: 'Salário', description: "Recebimento de salário" },
            { id: 1, nome: 'Freelas', description: "Trabalhos com freelancer" }
        ];

        return { categories }
    }
}