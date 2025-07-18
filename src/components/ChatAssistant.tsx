import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MessageCircle, X, Minus, Send } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileChatOverlay from './MobileChatAssistant';
import { useChatUser } from '../hooks/useChatUser';
import ChatWelcomeForm from './ChatWelcomeForm';
import { ChatUserData } from '../types/chat';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface KnowledgeBase {
  [key: string]: {
    keywords: string[];
    response: string;
    quickActions?: string[];
  };
}

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showChatBubble, setShowChatBubble] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    userData, 
    showWelcomeForm, 
    saveUserData, 
    clearUserData, 
    getUserDisplayName,
    setShowWelcomeForm 
  } = useChatUser();

  const isMobile = useIsMobile();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio on component mount
  useEffect(() => {
    // Create a simple water balloon burst sound using Web Audio API
    const createBurstSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playBurstSound = () => {
        // Create oscillators for the burst effect
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        // Connect nodes
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Configure the burst sound
        oscillator1.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator1.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
        oscillator2.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator2.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.15);

        // Volume envelope for burst effect
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        // Start and stop oscillators
        oscillator1.start(audioContext.currentTime);
        oscillator1.stop(audioContext.currentTime + 0.2);
        oscillator2.start(audioContext.currentTime + 0.05);
        oscillator2.stop(audioContext.currentTime + 0.25);
      };
      return playBurstSound;
    };
    try {
      const playSound = createBurstSound();
      audioRef.current = {
        play: playSound
      } as any;
    } catch (error) {
      console.warn('Audio context not available:', error);
    }
  }, []);

  // Show chat bubble after 20 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChatBubble(true);
      setHasNotification(true);

      // Play burst sound when bubble appears
      if (audioRef.current && typeof audioRef.current.play === 'function') {
        try {
          audioRef.current.play();
        } catch (error) {
          console.warn('Could not play sound:', error);
        }
      }
    }, 20000); // 20 seconds

    return () => clearTimeout(timer);
  }, []);

  const knowledgeBase: KnowledgeBase = {
    'criar_conta': {
      keywords: ['criar conta', 'registrar', 'cadastrar', 'sign up', 'registro'],
      response: '📝 **Como criar sua conta no e-Loomini:**\n\n1. Clique em "Cadastrar" no canto superior direito\n2. Preencha seus dados: nome, email e senha\n3. Escolha seu tipo: Comprador ou Criador\n4. Confirme seu email\n5. Pronto! Sua conta está criada ✅\n\n💡 **Dica:** Criadores podem vender produtos, compradores podem apenas comprar.',
      quickActions: ['Ir para Cadastro', 'Diferença entre tipos']
    },
    'comprar_produtos': {
      keywords: ['comprar', 'purchase', 'como comprar', 'carrinho', 'pagamento'],
      response: '🛒 **Como comprar produtos:**\n\n1. Navegue pelos produtos ou use a busca\n2. Clique no produto desejado\n3. Leia a descrição e avaliações\n4. Clique em "Comprar Agora"\n5. Faça login se necessário\n6. Confirme o pagamento\n7. Acesse o produto em "Minhas Compras"\n\n💳 **Aceitos:** Cartões de crédito, débito e transfers bancárias',
      quickActions: ['Ver Produtos', 'Minhas Compras']
    },
    'diferenca_produtos': {
      keywords: ['diferença', 'ebook', 'curso', 'tipos', 'produto'],
      response: '📚 **Diferenças entre E-books e Cursos:**\n\n**E-books:**\n• Conteúdo em PDF\n• Leitura offline\n• Acesso imediato\n• Preço mais baixo\n\n**Cursos:**\n• Vídeos + materiais\n• Módulos organizados\n• Progresso acompanhado\n• Certificado (alguns)\n• Preço mais alto\n\n🎯 **Escolha:** E-book para leitura rápida, Curso para aprendizado completo',
      quickActions: ['Ver E-books', 'Ver Cursos']
    },
    'tornar_criador': {
      keywords: ['criador', 'vender', 'creator', 'como vender'],
      response: '🎨 **Como se tornar criador:**\n\n1. Crie conta como "Criador"\n2. Complete seu perfil\n3. Acesse "Painel do Criador"\n4. Clique em "Criar Produto"\n5. Escolha: E-book ou Curso\n6. Preencha informações\n7. Faça upload do conteúdo\n8. Defina preço\n9. Publique!\n\n💰 **Ganhe:** 70% do valor de cada venda',
      quickActions: ['Criar Produto', 'Painel Criador']
    },
    'criar_produto': {
      keywords: ['criar produto', 'primeiro produto', 'upload', 'publicar'],
      response: '🚀 **Guia para criar seu primeiro produto:**\n\n**Passo a passo:**\n1. Acesse "Criar Produto"\n2. Escolha categoria\n3. Título atrativo\n4. Descrição detalhada\n5. Defina preço (MZN/AOA)\n6. Upload da capa\n7. Upload do conteúdo\n8. Revise tudo\n9. Publique!\n\n✅ **Dicas:** Use títulos claros, descrições completas e capas atrativas',
      quickActions: ['Criar Agora', 'Ver Exemplos']
    },
    'categorias': {
      keywords: ['categorias', 'categoria', 'tipos', 'assuntos'],
      response: '📂 **Categorias disponíveis:**\n\n• **Tecnologia** - Programação, Design, TI\n• **Negócios** - Empreendedorismo, Vendas, Marketing\n• **Educação** - Cursos acadêmicos, Línguas\n• **Arte** - Design, Fotografia, Música\n• **Saúde** - Fitness, Nutrição, Bem-estar\n• **Desenvolvimento Pessoal** - Autoajuda, Produtividade\n• **Culinária** - Receitas, Técnicas\n• **Outros** - Conteúdos diversos\n\n🎯 **Escolha** a categoria que melhor se adequa ao seu produto',
      quickActions: ['Ver por Categoria']
    },
    'pagamento': {
      keywords: ['pagamento', 'pagar', 'cartão', 'mpesa', 'dinheiro'],
      response: '💳 **Sistema de Pagamento:**\n\n**Métodos aceitos:**\n• Cartão de crédito/débito\n• M-Pesa (Moçambique)\n• Transferência bancária\n• Carteira digital\n\n**Moedas:**\n• MZN (Metical)\n• AOA (Kwanza)\n• USD (Dólar)\n\n🔒 **Segurança:** Todos os pagamentos são criptografados e seguros',
      quickActions: ['Ver Preços', 'Suporte Pagamento']
    },
    'problemas_login': {
      keywords: ['login', 'entrar', 'senha', 'email', 'acesso'],
      response: '🔐 **Problemas de Login - Soluções:**\n\n**Não consigo entrar:**\n1. Verifique email e senha\n2. Tente "Esqueci minha senha"\n3. Verifique spam/lixo eletrônico\n4. Limpe cache do navegador\n5. Tente outro navegador\n\n**Erro persistente:**\n• Conta pode estar bloqueada\n• Contate suporte técnico\n\n🆘 **Precisa de ajuda?** Fale conosco!',
      quickActions: ['Recuperar Senha', 'Contato Suporte']
    },
    'acessar_compras': {
      keywords: ['minhas compras', 'acessar', 'download', 'baixar'],
      response: '📥 **Como acessar produtos comprados:**\n\n1. Faça login na sua conta\n2. Clique em "Minhas Compras"\n3. Encontre o produto\n4. Clique em "Acessar"\n5. Para e-books: Download PDF\n6. Para cursos: Assistir vídeos\n\n💡 **Acesso:** Disponível para sempre após compra\n\n❓ **Não encontra?** Verifique se o pagamento foi confirmado',
      quickActions: ['Minhas Compras', 'Suporte Técnico']
    },
    'reportar_bugs': {
      keywords: ['bug', 'erro', 'problema', 'não funciona', 'travou'],
      response: '🐛 **Como reportar problemas técnicos:**\n\n**Antes de reportar:**\n1. Atualize a página (F5)\n2. Limpe cache do navegador\n3. Tente outro navegador\n4. Verifique sua conexão\n\n**Para reportar:**\n1. Descreva o problema\n2. Quando aconteceu\n3. Que página estava\n4. Seu navegador/dispositivo\n\n📱 **Contato:** Nosso suporte técnico pode ajudar pelo WhatsApp: +258 84 123 4567',
      quickActions: ['Suporte Técnico']
    },
    'editar_produtos': {
      keywords: ['editar', 'alterar', 'modificar', 'excluir', 'deletar'],
      response: '✏️ **Gerenciar seus produtos:**\n\n**Para editar:**\n1. Painel do Criador\n2. "Meus Produtos"\n3. Clique no produto\n4. Botão "Editar"\n5. Faça alterações\n6. Salve as mudanças\n\n**Para excluir:**\n1. Mesmo caminho\n2. Botão "Excluir"\n3. Confirme ação\n\n⚠️ **Atenção:** Exclusão é permanente',
      quickActions: ['Painel Criador', 'Meus Produtos']
    },
    'alterar_precos': {
      keywords: ['preço', 'valor', 'custo', 'barato', 'caro'],
      response: '💰 **Estratégias de Preços:**\n\n**Como definir:**\n1. Pesquise concorrentes\n2. Considere valor do conteúdo\n3. Teste preços diferentes\n4. Monitore vendas\n\n**Alterar preços:**\n• Painel → Editar Produto\n• Novos preços aplicam imediatamente\n\n💡 **Dicas:** Preços baixos = mais vendas, Preços altos = mais margem',
      quickActions: ['Alterar Preços', 'Ver Relatórios']
    },
    'descontos': {
      keywords: ['desconto', 'promoção', 'oferta', 'cupom'],
      response: '🎯 **Sistema de Descontos:**\n\n**Recursos disponíveis:**\n• Descontos por tempo limitado\n• Cupons de desconto\n• Promoções sazonais\n• Preços promocionais\n\n**Como criar:**\n1. Painel do Criador\n2. Selecione produto\n3. "Criar Promoção"\n4. Defina desconto e prazo\n\n📈 **Resultado:** Aumenta vendas significativamente',
      quickActions: ['Criar Promoção', 'Ver Vendas']
    },
    'moedas': {
      keywords: ['moeda', 'mzn', 'aoa', 'metical', 'kwanza', 'dolar'],
      response: '💱 **Conversão de Moedas:**\n\n**Moedas suportadas:**\n• MZN - Metical (Moçambique)\n• AOA - Kwanza (Angola)\n• USD - Dólar (Internacional)\n\n**Conversão automática:**\n• Baseada na taxa atual\n• Atualizada diariamente\n• Transparente para usuários\n\n💳 **Pagamento:** Na moeda local do comprador',
      quickActions: ['Ver Taxas', 'Configurar Moeda']
    },
    'progresso_alunos': {
      keywords: ['progresso', 'alunos', 'estatísticas', 'analytics'],
      response: '📊 **Acompanhar Progresso dos Alunos:**\n\n**Dados disponíveis:**\n• Número de visualizações\n• Tempo de consumo\n• Progresso por módulo\n• Taxa de conclusão\n• Feedback dos alunos\n\n**Onde ver:**\n• Painel do Criador\n• Aba "Analytics"\n• Relatórios detalhados\n\n📈 **Use para:** Melhorar conteúdo',
      quickActions: ['Ver Analytics', 'Relatórios']
    },
    'outras_linguas': {
      keywords: ['língua', 'idioma', 'português', 'inglês', 'espanhol'],
      response: '🌍 **Conteúdo Multi-idioma:**\n\n**Idiomas suportados:**\n• Português (principal)\n• Inglês\n• Espanhol\n• Francês\n\n**Como criar:**\n1. Crie versões separadas\n2. Indique idioma no título\n3. Use tags de idioma\n4. Público-alvo específico\n\n🎯 **Amplie** seu alcance com múltiplos idiomas',
      quickActions: ['Criar Versão', 'Ver Exemplos']
    },
    'relatorios_vendas': {
      keywords: ['relatório', 'vendas', 'ganhos', 'receita', 'download'],
      response: '📈 **Relatórios de Vendas:**\n\n**Dados inclusos:**\n• Vendas por período\n• Receita total\n• Produtos mais vendidos\n• Perfil dos compradores\n• Tendências de mercado\n\n**Formatos:**\n• PDF para impressão\n• Excel para análise\n• Gráficos interativos\n\n📊 **Acesso:** Painel do Criador → Relatórios',
      quickActions: ['Baixar Relatório', 'Ver Vendas']
    },
    'reembolso': {
      keywords: ['reembolso', 'devolução', 'dinheiro de volta', 'cancelar'],
      response: '💸 **Política de Reembolso:**\n\n**Prazo:** 7 dias após compra\n\n**Motivos aceitos:**\n• Produto não conforme descrição\n• Problemas técnicos\n• Duplicação de compra\n• Cancelamento justificado\n\n**Processo:**\n1. Contate suporte\n2. Informe motivo\n3. Análise em 48h\n4. Reembolso aprovado\n\n⏰ **Prazo:** 5-7 dias úteis',
      quickActions: ['Solicitar Reembolso', 'Contato Suporte']
    },
    'avaliacoes': {
      keywords: ['avaliação', 'review', 'nota', 'estrelas', 'comentário'],
      response: '⭐ **Sistema de Avaliações:**\n\n**Como funciona:**\n• Compradores avaliam produtos\n• Notas de 1 a 5 estrelas\n• Comentários opcionais\n• Média visível publicamente\n\n**Para criadores:**\n• Respondam avaliações\n• Melhorem com feedback\n• Monitorem satisfação\n\n📊 **Impacto:** Mais avaliações = mais vendas',
      quickActions: ['Ver Avaliações', 'Responder Reviews']
    },
    'contato_criadores': {
      keywords: ['contato', 'criadores', 'networking', 'comunidade'],
      response: '🤝 **Networking entre Criadores:**\n\n**Recursos disponíveis:**\n• Perfis públicos de criadores\n• Sistema de mensagens\n• Fóruns de discussão\n• Grupos por categoria\n• Eventos online\n\n**Como conectar:**\n1. Acesse perfil do criador\n2. Clique "Enviar Mensagem"\n3. Participe de fóruns\n4. Junte-se a grupos\n\n💡 **Benefícios:** Colaborações e aprendizado',
      quickActions: ['Encontrar Criadores', 'Participar Fóruns']
    }
  };

  const quickActionButtons = ['Como Comprar', 'Ver Produtos', 'Suporte Técnico'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && hasNotification) {
      setHasNotification(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && messages.length === 0 && userData) {
      const welcomeMessage = `Olá ${userData.name}! 👋 Sou o assistente do e-Loomini. Como posso ajudá-lo hoje?`;
      setMessages([{
        id: Date.now().toString(),
        text: welcomeMessage,
        sender: 'assistant',
        timestamp: new Date()
      }]);
    }
  }, [isOpen, userData]);

  const findBestMatch = (input: string): string | null => {
    const lowerInput = input.toLowerCase();
    for (const [key, data] of Object.entries(knowledgeBase)) {
      if (data.keywords.some(keyword => lowerInput.includes(keyword))) {
        return key;
      }
    }
    return null;
  };

  const getAssistantResponse = (userInput: string): string => {
    const match = findBestMatch(userInput);
    if (match) {
      return knowledgeBase[match].response;
    }

    // Fallback responses
    if (userInput.toLowerCase().includes('obrigad')) {
      return '😊 De nada! Fico feliz em ajudar. Há mais alguma coisa que posso esclarecer?';
    }
    if (userInput.toLowerCase().includes('tchau') || userInput.toLowerCase().includes('até')) {
      return '👋 Até logo! Sempre que precisar, estarei aqui para ajudar. Tenha um ótimo dia!';
    }
    return `Entendo sua dúvida, mas preciso pesquisar melhor para te dar uma resposta precisa! 🤔\n\nPara questões específicas como esta, posso verificar nossa base de conhecimento ou você pode entrar em contato com nosso suporte especializado:\n\n📱 **WhatsApp:** +258 84 123 4567\n\n💬 **Nosso especialista pode ajudar com:**\n• Problemas técnicos específicos\n• Questões de pagamento\n• Suporte personalizado\n• Dúvidas complexas\n\n🕐 **Horário:** Segunda a sexta, 8h às 18h`;
  };

  // Calculate delay based on response length (realistic reading/thinking time)
  const calculateResponseDelay = (response: string): number => {
    const wordCount = response.split(' ').length;
    const baseDelay = 2000; // 2 seconds minimum
    const wordDelay = 50; // 50ms per word (reading time)
    const thinkingTime = 1000; // Additional thinking time
    
    const totalDelay = baseDelay + (wordCount * wordDelay) + thinkingTime;
    
    // Cap maximum delay at 15 seconds, minimum at 3 seconds
    return Math.min(Math.max(totalDelay, 3000), 15000);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !userData) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);
    setShowQuickActions(false);

    // Get the response first to calculate appropriate delay
    const assistantResponse = getAssistantResponse(currentInput);
    const delay = calculateResponseDelay(assistantResponse);

    // Add realistic delay based on response length
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: assistantResponse,
      sender: 'assistant',
      timestamp: new Date()
    };
    setIsTyping(false);
    setMessages(prev => [...prev, assistantMessage]);
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
    handleSendMessage();
  };

  const formatMessage = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={index} className="font-semibold text-blue-600 mb-1">{line.slice(2, -2)}</div>;
      }
      if (line.startsWith('• ')) {
        return <div key={index} className="ml-4 mb-1">{line}</div>;
      }
      return <div key={index} className="mb-1">{line}</div>;
    });
  };

  const handleUserDataSubmit = (data: ChatUserData) => {
    saveUserData(data);
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    if (!userData) {
      setShowWelcomeForm(true);
    }
  };

  const handleCloseWelcomeForm = () => {
    setShowWelcomeForm(false);
    setIsOpen(false);
  };

  // Don't render anything if chat bubble hasn't appeared yet
  if (!showChatBubble) {
    return null;
  }

  // Mobile overlay for full-screen experience
  if (isMobile && isOpen && userData) {
    return createPortal(
      <MobileChatOverlay 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        messages={messages} 
        inputValue={inputValue} 
        setInputValue={setInputValue} 
        onSendMessage={handleSendMessage} 
        isTyping={isTyping} 
        showQuickActions={showQuickActions} 
        quickActionButtons={quickActionButtons} 
        onQuickAction={handleQuickAction} 
        formatMessage={formatMessage} 
      />, 
      document.body
    );
  }

  // Desktop widget
  const chatWidget = (
    <div className="fixed bottom-5 right-5 z-[1000]">
      {!isOpen && (
        <button
          onClick={handleOpenChat}
          aria-label="Abrir chat de ajuda"
          className="relative bg-blue-600 hover:bg-blue-700 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 group font-normal"
        >
          <MessageCircle size={24} />
          {hasNotification && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
              1
            </span>
          )}
          <span className="absolute right-full mr-3 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Ajuda
          </span>
        </button>
      )}

      {isOpen && userData && (
        <div className={`bg-white rounded-lg shadow-2xl border transition-all duration-300 ${isMinimized ? 'w-80 h-12' : 'w-96 h-[600px] max-h-[80vh]'} flex flex-col`}>
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle size={20} />
              <div>
                <span className="font-semibold">Assistente e-Loomini</span>
                <div className="text-xs text-blue-100">
                  Conversando com {getUserDisplayName()}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearUserData}
                className="p-1 hover:bg-blue-700 rounded transition-colors text-xs"
                title="Alterar dados"
              >
                ⚙️
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-blue-700 rounded transition-colors"
                aria-label={isMinimized ? "Maximizar" : "Minimizar"}
              >
                <Minus size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-blue-700 rounded transition-colors"
                aria-label="Fechar chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                      <div className="text-sm">{formatMessage(message.text)}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <span className="ml-2 text-sm">Assistente está digitando...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              {showQuickActions && (
                <div className="px-4 py-2 border-t bg-gray-50">
                  <div className="text-xs text-gray-500 mb-2">Ações rápidas:</div>
                  <div className="flex flex-wrap gap-2">
                    {quickActionButtons.map(action => (
                      <button
                        key={action}
                        onClick={() => handleQuickAction(action)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors duration-200"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t bg-white">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Digite sua pergunta..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    aria-label="Enviar mensagem"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Welcome Form */}
      {showWelcomeForm && (
        <ChatWelcomeForm
          onSubmit={handleUserDataSubmit}
          onClose={handleCloseWelcomeForm}
        />
      )}
    </div>
  );

  return createPortal(chatWidget, document.body);
};

export default ChatAssistant;
