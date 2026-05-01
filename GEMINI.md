# QueryBot - Guia do Desenvolvedor 

Este documento serve como a fonte da verdade para o desenvolvimento do QueryBot, uma plataforma educativa gamificada para ensino de SQL com temática espacial.

## Regras de acesso
- Ver disponibilidade de veículos PERMITIDO
- Ver Categorias de veículos PERMITIDO

- Cadastrar / editar cliente, Cadastrar / editar veículo, Cadastrar / editar categoria, Registrar nova locação, Dar baixa / devolver veículo. APENAS LOGADOS

---

## Tech Stack
- **Framework:** React 19
- **Build Tool:** Vite 8
- **Roteamento:** React Router 
- **Estilização:** Tailwind CSS (configurado com variáveis CSS nativas)
- **Requisições:** Axios (Configurado com `withCredentials: true` para lidar com cookies de sessão)

---

### Regras de Ouro
1. **Responsividade:** Mobile-first é obrigatório. Use classes `md:`, `lg:` para ajustes de tela.
2. **Homogeneidade:** Siga um padrão visual consistente para que o projeto fique conciso.
3. **Vanilla Tailwind:** Evite CSS inline ou módulos CSS. Use apenas classes Tailwind vinculadas ao `@theme` no `global.css`.

---

## Referência da API
Base URL deve ser configurada globalmente no Axios. **Importante:** Todas as requisições autenticadas devem incluir cookies.

Esse é o json da open api use isso para mapear a api e criar os endpoints a api vai estar rodando no `https://localhost:7221/`

{
  "openapi": "3.0.4",
  "info": {
    "title": "LocadoraVeiculos.API",
    "version": "1.0"
  },
  "paths": {
    "/auth/register": {
      "post": {
        "tags": [
          "Auth"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RegisterRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK"
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "application/problem+json": {
                "schema": {
                  "$ref": "#/components/schemas/HttpValidationProblemDetails"
                }
              }
            }
          }
        }
      }
    },
    "/auth/login": {
      "post": {
        "tags": [
          "Auth"
        ],
        "parameters": [
          {
            "name": "useCookies",
            "in": "query",
            "schema": {
              "type": "boolean"
            }
          },
          {
            "name": "useSessionCookies",
            "in": "query",
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/LoginRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AccessTokenResponse"
                }
              }
            }
          }
        }
      }
    },
    "/auth/manage/info": {
      "get": {
        "tags": [
          "Auth"
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InfoResponse"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "application/problem+json": {
                "schema": {
                  "$ref": "#/components/schemas/HttpValidationProblemDetails"
                }
              }
            }
          },
          "404": {
            "description": "Not Found"
          }
        }
      },
      "post": {
        "tags": [
          "Auth"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/InfoRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InfoResponse"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "application/problem+json": {
                "schema": {
                  "$ref": "#/components/schemas/HttpValidationProblemDetails"
                }
              }
            }
          },
          "404": {
            "description": "Not Found"
          }
        }
      }
    },
    "/auth/logout": {
      "post": {
        "tags": [
          "Auth"
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/categoria": {
      "get": {
        "tags": [
          "CategoriaVeiculo"
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      },
      "post": {
        "tags": [
          "CategoriaVeiculo"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RequestAdicionarCategoriaVeiculoDTO"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/RequestAdicionarCategoriaVeiculoDTO"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/RequestAdicionarCategoriaVeiculoDTO"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      },
      "put": {
        "tags": [
          "CategoriaVeiculo"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RequestEditarCategoriaVeiculoDTO"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/RequestEditarCategoriaVeiculoDTO"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/RequestEditarCategoriaVeiculoDTO"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/clientes": {
      "get": {
        "tags": [
          "Cliente"
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/clientes/{id}": {
      "get": {
        "tags": [
          "Cliente"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/clientes/add": {
      "post": {
        "tags": [
          "Cliente"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RequestAdicionarClienteDTO"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/RequestAdicionarClienteDTO"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/RequestAdicionarClienteDTO"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/clientes/edit": {
      "put": {
        "tags": [
          "Cliente"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RequestEditarClienteDTO"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/RequestEditarClienteDTO"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/RequestEditarClienteDTO"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/veiculos": {
      "get": {
        "tags": [
          "Veiculo"
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      },
      "post": {
        "tags": [
          "Veiculo"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RequestAdicionarVeiculoDTO"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/RequestAdicionarVeiculoDTO"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/RequestAdicionarVeiculoDTO"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      },
      "put": {
        "tags": [
          "Veiculo"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RequestEditarVeiculoDTO"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/RequestEditarVeiculoDTO"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/RequestEditarVeiculoDTO"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/veiculos/disponivel": {
      "get": {
        "tags": [
          "Veiculo"
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/veiculoalocado": {
      "get": {
        "tags": [
          "VeiculoAlocado"
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/veiculoalocado/disponibilidade": {
      "get": {
        "tags": [
          "VeiculoAlocado"
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/veiculoalocado/add": {
      "post": {
        "tags": [
          "VeiculoAlocado"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RequestAdicionarVeiculoAlocadoDTO"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/RequestAdicionarVeiculoAlocadoDTO"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/RequestAdicionarVeiculoAlocadoDTO"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/veiculoalocado/darbaixa": {
      "put": {
        "tags": [
          "VeiculoAlocado"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "AccessTokenResponse": {
        "required": [
          "accessToken",
          "expiresIn",
          "refreshToken"
        ],
        "type": "object",
        "properties": {
          "tokenType": {
            "type": "string",
            "nullable": true,
            "readOnly": true
          },
          "accessToken": {
            "type": "string",
            "nullable": true
          },
          "expiresIn": {
            "type": "integer",
            "format": "int64"
          },
          "refreshToken": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "ForgotPasswordRequest": {
        "required": [
          "email"
        ],
        "type": "object",
        "properties": {
          "email": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "HttpValidationProblemDetails": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "nullable": true
          },
          "title": {
            "type": "string",
            "nullable": true
          },
          "status": {
            "type": "integer",
            "format": "int32",
            "nullable": true
          },
          "detail": {
            "type": "string",
            "nullable": true
          },
          "instance": {
            "type": "string",
            "nullable": true
          },
          "errors": {
            "type": "object",
            "additionalProperties": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "nullable": true
          }
        },
        "additionalProperties": {

        }
      },
      "InfoRequest": {
        "type": "object",
        "properties": {
          "newEmail": {
            "type": "string",
            "nullable": true
          },
          "newPassword": {
            "type": "string",
            "nullable": true
          },
          "oldPassword": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "InfoResponse": {
        "required": [
          "email",
          "isEmailConfirmed"
        ],
        "type": "object",
        "properties": {
          "email": {
            "type": "string",
            "nullable": true
          },
          "isEmailConfirmed": {
            "type": "boolean"
          }
        },
        "additionalProperties": false
      },
      "LoginRequest": {
        "required": [
          "email",
          "password"
        ],
        "type": "object",
        "properties": {
          "email": {
            "type": "string",
            "nullable": true
          },
          "password": {
            "type": "string",
            "nullable": true
          },
          "twoFactorCode": {
            "type": "string",
            "nullable": true
          },
          "twoFactorRecoveryCode": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "RefreshRequest": {
        "required": [
          "refreshToken"
        ],
        "type": "object",
        "properties": {
          "refreshToken": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "RegisterRequest": {
        "required": [
          "email",
          "password"
        ],
        "type": "object",
        "properties": {
          "email": {
            "type": "string",
            "nullable": true
          },
          "password": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "RequestAdicionarCategoriaVeiculoDTO": {
        "type": "object",
        "properties": {
          "nome": {
            "type": "string",
            "nullable": true
          },
          "descricao": {
            "type": "string",
            "nullable": true
          },
          "valorDiaria": {
            "type": "number",
            "format": "double"
          }
        },
        "additionalProperties": false
      },
      "RequestAdicionarClienteDTO": {
        "type": "object",
        "properties": {
          "nome": {
            "type": "string",
            "nullable": true
          },
          "cpf": {
            "type": "string",
            "nullable": true
          },
          "email": {
            "type": "string",
            "nullable": true
          },
          "telefone": {
            "type": "string",
            "nullable": true
          },
          "dataNasc": {
            "type": "string",
            "format": "date"
          },
          "endereco": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "RequestAdicionarVeiculoAlocadoDTO": {
        "type": "object",
        "properties": {
          "clienteId": {
            "type": "string",
            "format": "uuid"
          },
          "placaVeiculo": {
            "type": "string",
            "nullable": true
          },
          "dataRetirada": {
            "type": "string",
            "format": "date-time"
          },
          "dataPrevDevol": {
            "type": "string",
            "format": "date-time"
          }
        },
        "additionalProperties": false
      },
      "RequestAdicionarVeiculoDTO": {
        "type": "object",
        "properties": {
          "placa": {
            "type": "string",
            "nullable": true
          },
          "marca": {
            "type": "string",
            "nullable": true
          },
          "modelo": {
            "type": "string",
            "nullable": true
          },
          "ano": {
            "type": "integer",
            "format": "int32"
          },
          "cor": {
            "type": "string",
            "nullable": true
          },
          "categoriaId": {
            "type": "string",
            "format": "uuid"
          },
          "imagemUrl": {
            "type": "string",
            "nullable": true
          },
          "disponivel": {
            "type": "boolean"
          }
        },
        "additionalProperties": false
      },
      "RequestEditarCategoriaVeiculoDTO": {
        "type": "object",
        "properties": {
          "nome": {
            "type": "string",
            "nullable": true
          },
          "descricao": {
            "type": "string",
            "nullable": true
          },
          "valorDiaria": {
            "type": "number",
            "format": "double"
          },
          "ativo": {
            "type": "boolean"
          }
        },
        "additionalProperties": false
      },
      "RequestEditarClienteDTO": {
        "type": "object",
        "properties": {
          "nome": {
            "type": "string",
            "nullable": true
          },
          "cpf": {
            "type": "string",
            "nullable": true
          },
          "email": {
            "type": "string",
            "nullable": true
          },
          "telefone": {
            "type": "string",
            "nullable": true
          },
          "dataNasc": {
            "type": "string",
            "format": "date"
          },
          "endereco": {
            "type": "string",
            "nullable": true
          },
          "ativo": {
            "type": "boolean"
          }
        },
        "additionalProperties": false
      },
      "RequestEditarVeiculoDTO": {
        "type": "object",
        "properties": {
          "placa": {
            "type": "string",
            "nullable": true
          },
          "marca": {
            "type": "string",
            "nullable": true
          },
          "modelo": {
            "type": "string",
            "nullable": true
          },
          "ano": {
            "type": "integer",
            "format": "int32"
          },
          "cor": {
            "type": "string",
            "nullable": true
          },
          "categoriaId": {
            "type": "string",
            "format": "uuid"
          },
          "imagemUrl": {
            "type": "string",
            "nullable": true
          },
          "disponivel": {
            "type": "boolean"
          },
          "ativo": {
            "type": "boolean"
          }
        },
        "additionalProperties": false
      },
      "ResendConfirmationEmailRequest": {
        "required": [
          "email"
        ],
        "type": "object",
        "properties": {
          "email": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "ResetPasswordRequest": {
        "required": [
          "email",
          "newPassword",
          "resetCode"
        ],
        "type": "object",
        "properties": {
          "email": {
            "type": "string",
            "nullable": true
          },
          "resetCode": {
            "type": "string",
            "nullable": true
          },
          "newPassword": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "TwoFactorRequest": {
        "type": "object",
        "properties": {
          "enable": {
            "type": "boolean",
            "nullable": true
          },
          "twoFactorCode": {
            "type": "string",
            "nullable": true
          },
          "resetSharedKey": {
            "type": "boolean"
          },
          "resetRecoveryCodes": {
            "type": "boolean"
          },
          "forgetMachine": {
            "type": "boolean"
          }
        },
        "additionalProperties": false
      },
      "TwoFactorResponse": {
        "required": [
          "isMachineRemembered",
          "isTwoFactorEnabled",
          "recoveryCodesLeft",
          "sharedKey"
        ],
        "type": "object",
        "properties": {
          "sharedKey": {
            "type": "string",
            "nullable": true
          },
          "recoveryCodesLeft": {
            "type": "integer",
            "format": "int32"
          },
          "recoveryCodes": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "nullable": true
          },
          "isTwoFactorEnabled": {
            "type": "boolean"
          },
          "isMachineRemembered": {
            "type": "boolean"
          }
        },
        "additionalProperties": false
      }
    }
  },
  "tags": [
    {
      "name": "Auth"
    },
    {
      "name": "CategoriaVeiculo"
    },
    {
      "name": "Cliente"
    },
    {
      "name": "Veiculo"
    },
    {
      "name": "VeiculoAlocado"
    }
  ]
}