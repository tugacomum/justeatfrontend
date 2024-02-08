import { useEffect } from "react";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import { useUser } from "../../Contexts/User";

export default function Legal(){
    const { getUserInfo } = useUser();

    useEffect(() => {
        getUserInfo();
    }, []);

    return (
        <div className="absolute w-full h-full flex flex-col">
            <div className="flex flex-col min-w-full min-h-full">
                <div className="p-8 h-full">
                    <Header />
                    <div className="w-full flex flex-col items-center mt-8">
                        <h1 className="text-5xl font-poppins text-zinc-700 font-bold">Terms & Conditions</h1>
                        <div className="w-4/5 p-4 border rounded shadow mt-4 font-poppins font-extralight">
                            <p>Na JustEat Portugal, valorizamos a sua privacidade e comprometemo-nos a proteger os seus dados pessoais. Esta Política de Privacidade explica como recolhemos, utilizamos, partilhamos e protegemos as suas informações quando utiliza os nossos serviços.</p>
                            <ul className="mt-8 flex flex-col space-y-1">
                                <li>1. Informações Recolhidas: Recolhemos informações pessoais que nos fornece diretamente, como nome, endereço, e-mail e número de telefone. Também podemos recolher informações sobre as suas interações com o nosso site para melhorar a sua experiência.</li>
                                <li>2. Utilização dos Dados: Utilizamos os dados recolhidos para processar encomendas, melhorar os nossos serviços, personalizar a sua experiência e fornecer informações relevantes sobre promoções ou atualizações.</li>
                                <li>3. Partilha de Dados: Comprometemo-nos a não partilhar as suas informações pessoais com terceiros sem o seu consentimento, exceto quando necessário para processar encomendas ou cumprir requisitos legais.</li>
                                <li>4. Segurança dos Dados: Implementamos medidas de segurança para proteger as suas informações contra acesso não autorizado, alteração ou divulgação. Os seus dados são tratados com a máxima confidencialidade.</li>
                                <li>5. Direitos do Utilizador: Em conformidade com a legislação aplicável, tem o direito de aceder, retificar, apagar ou limitar o processamento dos seus dados pessoais.</li>
                                <li>6. Alterações à Política: Reservamo-nos o direito de atualizar esta Política de Privacidade. Recomendamos que reveja periodicamente para estar informado sobre as alterações.</li>
                                <li>7. Contacto: Se tiver questões sobre a nossa Política de Privacidade, entre em contacto connosco através dos dados fornecidos no nosso site</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}