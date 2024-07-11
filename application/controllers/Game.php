<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Game extends CI_Controller
{
    public $input;
    public $Highscore_model;

    public function index()
    {
        $this->load->view('start_menu');
    }

    public function play()
    {
        $this->load->view('tetris_game');
    }

    public function high_scores()
    {
        $this->load->model('Highscore_model');
        $data['highscores'] = $this->Highscore_model->get_highscores();
        $this->load->view('high_scores', $data);
    }

    public function save_score()
    {
        $this->load->model('Highscore_model');
        $score_data = array(
            'player_name' => $this->input->post('player_name'),
            'score' => $this->input->post('score')
        );
        $this->Highscore_model->save_score($score_data);
        redirect('game/high_scores');
    }
}
